"""
Rivan Reality LLP - Customer App Backend
FastAPI + MongoDB with OTP-based JWT authentication
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta, timezone
from pathlib import Path
import os
import uuid
import logging
import jwt as pyjwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ---------- Config ----------
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'rivan_reality')
JWT_SECRET = os.environ.get('JWT_SECRET', 'rivan-reality-dev-secret-change-in-prod')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRES_MIN = 60 * 24 * 30  # 30 days
MOCK_OTP = os.environ.get("MOCK_OTP", "123456")
OTP_DEV_MODE = os.environ.get("OTP_DEV_MODE", "true").lower() == "true"
CORS_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "*").split(",")
    if origin.strip()
]

if not MONGO_URL:
    raise RuntimeError("MONGO_URL is required. Set it to your MongoDB Atlas connection string.")

if JWT_SECRET == 'rivan-reality-dev-secret-change-in-prod':
    logger_warning = "Using development JWT_SECRET. Set JWT_SECRET in production."
else:
    logger_warning = None

client = AsyncIOMotorClient(
    MONGO_URL,
    serverSelectionTimeoutMS=8000,
    uuidRepresentation="standard",
)
db = client[DB_NAME]

api_router = APIRouter(prefix="/api")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("rivan")
if logger_warning:
    logger.warning(logger_warning)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await client.admin.command("ping")
        logger.info("Connected to MongoDB database '%s'.", DB_NAME)
    except Exception as exc:
        logger.exception("MongoDB connection failed. Check MONGO_URL, Atlas IP access, and DB credentials.")
        raise exc
    await seed_data()
    yield
    client.close()


app = FastAPI(title="Rivan Reality API", lifespan=lifespan)


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: Optional[datetime]) -> Optional[str]:
    return dt.isoformat() if dt else None


def normalize_phone(phone: str) -> str:
    digits = "".join(ch for ch in (phone or "") if ch.isdigit())
    if digits.startswith("91") and len(digits) == 12:
        digits = digits[2:]
    return digits[-10:]


def as_aware_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


# ---------- Auth helpers ----------
def create_access_token(subject: str) -> str:
    payload = {
        "sub": subject,
        "iat": now_utc(),
        "exp": now_utc() + timedelta(minutes=JWT_EXPIRES_MIN),
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> Dict[str, Any]:
    try:
        return pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Dict[str, Any]:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token subject")
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def get_admin_user(token: Optional[str] = Depends(oauth2_scheme)) -> Dict[str, Any]:
    user = await get_current_user(token)
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------- Models ----------
class SendOtpReq(BaseModel):
    phone: str

class VerifyOtpReq(BaseModel):
    phone: str
    otp: str
    name: Optional[str] = None

class TokenResp(BaseModel):
    access_token: str
    user: Dict[str, Any]

class UpdateProfileReq(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None

class BookingReq(BaseModel):
    plot_id: str
    name: str
    mobile: str
    whatsapp: Optional[str] = None
    message: Optional[str] = None

class ServiceReq(BaseModel):
    service_type: str
    property_id: Optional[str] = None
    preferred_date: str
    description: str
    contact: str

class VisitBookingReq(BaseModel):
    centre_id: str
    visit_date: str
    visit_time: str
    name: str
    mobile: str

class SiteVisitReq(BaseModel):
    property_id: str
    visit_date: str
    name: str
    mobile: str

class WishlistReq(BaseModel):
    property_id: str

class PayInstallmentReq(BaseModel):
    installment_id: str

class AdminPropertyReq(BaseModel):
    name: str
    category: str
    location: str
    starting_price: float
    size: str
    image: str
    description: Optional[str] = ""
    survey_number: Optional[str] = ""
    facing: Optional[str] = ""
    road_width: Optional[str] = ""
    amenities: Optional[List[str]] = []
    approvals: Optional[List[str]] = []


# ---------- Auth Routes ----------
@api_router.post("/auth/send-otp")
async def send_otp(req: SendOtpReq):
    phone = normalize_phone(req.phone)
    if len(phone) != 10:
        raise HTTPException(status_code=400, detail="Invalid phone number")
    await db.otps.update_one(
        {"phone": phone},
        {"$set": {
            "phone": phone,
            "otp": MOCK_OTP,
            "expires_at": now_utc() + timedelta(minutes=10),
            "created_at": now_utc(),
        }},
        upsert=True,
    )
    logger.info("OTP requested for %s", phone)
    resp = {"success": True, "message": "OTP sent."}
    if OTP_DEV_MODE:
        resp["dev_otp"] = MOCK_OTP
        resp["message"] = f"OTP sent. Use {MOCK_OTP} for dev."
    return resp


@api_router.post("/auth/verify-otp", response_model=TokenResp)
async def verify_otp(req: VerifyOtpReq):
    phone = normalize_phone(req.phone)
    if len(phone) != 10:
        raise HTTPException(status_code=400, detail="Invalid phone number")
    otp_doc = await db.otps.find_one({"phone": phone}, {"_id": 0})
    if not otp_doc:
        raise HTTPException(status_code=400, detail="No OTP requested for this number")
    expires_at = otp_doc.get("expires_at")
    if expires_at and as_aware_utc(expires_at) < now_utc():
        await db.otps.delete_one({"phone": phone})
        raise HTTPException(status_code=400, detail="OTP expired")
    if req.otp != otp_doc.get("otp"):
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Find or create user
    user = await db.users.find_one({"phone": phone}, {"_id": 0})
    if not user:
        user_id = str(uuid.uuid4())
        user = {
            "id": user_id,
            "phone": phone,
            "name": req.name or f"User-{phone[-4:]}",
            "email": "",
            "address": "",
            "kyc_status": "pending",
            "is_admin": False,
            "created_at": now_utc().isoformat(),
        }
        await db.users.insert_one(user.copy())
        # Welcome notification
        await db.notifications.insert_one({
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": "Welcome to Rivan Reality",
            "body": "Legacy of trust, legacy of wealth. Explore premium properties now.",
            "type": "welcome",
            "read": False,
            "created_at": now_utc().isoformat(),
        })
    user.pop("_id", None)
    await db.otps.delete_one({"phone": phone})
    token = create_access_token(user["id"])
    return TokenResp(access_token=token, user=user)


@api_router.get("/auth/me")
async def me(user: Dict[str, Any] = Depends(get_current_user)):
    user.pop("_id", None)
    return user


@api_router.get("/health")
async def health():
    await client.admin.command("ping")
    return {"status": "ok", "database": DB_NAME}


@api_router.put("/auth/profile")
async def update_profile(req: UpdateProfileReq, user: Dict[str, Any] = Depends(get_current_user)):
    update = {k: v for k, v in req.dict().items() if v is not None}
    if update:
        await db.users.update_one({"id": user["id"]}, {"$set": update})
    updated = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    return updated


# ---------- Properties ----------
@api_router.get("/properties")
async def list_properties(
    category: Optional[str] = None,
    location: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
):
    regional_location_regex = "Vizag|Vijayawada"
    q: Dict[str, Any] = {"location": {"$regex": regional_location_regex, "$options": "i"}}
    if category and category.lower() != "all":
        q["category"] = category
    if location and location.lower() != "all":
        if location.lower() not in ("vizag", "vijayawada"):
            return []
        q["location"] = {"$regex": location, "$options": "i"}
    if min_price is not None:
        q["starting_price"] = {"$gte": min_price}
    if max_price is not None:
        q.setdefault("starting_price", {})
        q["starting_price"]["$lte"] = max_price
    if search:
        q["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]
    items = await db.properties.find(q, {"_id": 0}).to_list(200)
    return items


@api_router.get("/properties/featured")
async def featured_properties():
    items = await db.properties.find({
        "featured": True,
        "location": {"$regex": "Vizag|Vijayawada", "$options": "i"},
    }, {"_id": 0}).to_list(20)
    return items


@api_router.get("/properties/{property_id}")
async def get_property(property_id: str):
    prop = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop


@api_router.get("/properties/{property_id}/plots")
async def get_property_plots(property_id: str):
    plots = await db.plots.find({"property_id": property_id}, {"_id": 0}).to_list(500)
    return plots


@api_router.get("/plots/{plot_id}")
async def get_plot(plot_id: str):
    plot = await db.plots.find_one({"id": plot_id}, {"_id": 0})
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    return plot


# ---------- Bookings ----------
@api_router.post("/bookings")
async def create_booking(req: BookingReq, user: Dict[str, Any] = Depends(get_current_user)):
    plot = await db.plots.find_one({"id": req.plot_id}, {"_id": 0})
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    if plot.get("status") not in ("available", "reserved"):
        raise HTTPException(status_code=400, detail="Plot is not available for booking")

    booking_id = str(uuid.uuid4())
    booking = {
        "id": booking_id,
        "user_id": user["id"],
        "plot_id": req.plot_id,
        "property_id": plot["property_id"],
        "name": req.name,
        "mobile": req.mobile,
        "whatsapp": req.whatsapp or req.mobile,
        "message": req.message or "",
        "status": "pending",
        "created_at": now_utc().isoformat(),
    }
    await db.bookings.insert_one(booking.copy())
    booking.pop("_id", None)
    # Mark plot as reserved
    await db.plots.update_one({"id": req.plot_id}, {"$set": {"status": "reserved"}})

    # Notification
    await db.notifications.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "title": "Booking Request Received",
        "body": f"Your booking for plot {plot.get('plot_number')} has been received. Our team will contact you shortly.",
        "type": "booking",
        "read": False,
        "created_at": now_utc().isoformat(),
    })
    return {"success": True, "booking": booking, "message": "Thank you. Our Rivan team will contact you shortly."}


@api_router.get("/bookings/mine")
async def my_bookings(user: Dict[str, Any] = Depends(get_current_user)):
    items = await db.bookings.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    return items


# ---------- My Land ----------
@api_router.get("/myland")
async def my_land(user: Dict[str, Any] = Depends(get_current_user)):
    """Return units owned/booked by this user with purchase progress"""
    plots = await db.plots.find(
        {"owner_id": user["id"]}, {"_id": 0}
    ).to_list(100)
    enriched = []
    for plot in plots:
        prop = await db.properties.find_one({"id": plot["property_id"]}, {"_id": 0})
        # Compute progress for this plot
        installments = await db.installments.find(
            {"user_id": user["id"], "plot_id": plot["id"]}, {"_id": 0}
        ).to_list(100)
        total_amt = sum(i["amount"] for i in installments) or plot.get("price", 0)
        paid_amt = sum(i["amount"] for i in installments if i["status"] == "paid")
        # For sold plots without installment records (legacy), treat as fully paid
        if plot.get("status") == "sold" and not installments:
            paid_amt = total_amt
        progress = (paid_amt / total_amt) if total_amt > 0 else 0
        # Purchase completion: status sold OR all installments paid
        purchase_complete = plot.get("status") == "sold" or progress >= 1.0
        # Compute registration timeline
        timeline = [
            {"step": "Booking Confirmed", "done": True, "date": plot.get("created_at", "")[:10]},
            {"step": "Token Paid", "done": paid_amt > 0, "date": ""},
            {"step": "Agreement Signed", "done": progress >= 0.25, "date": ""},
            {"step": "Installments Complete", "done": progress >= 1.0, "date": ""},
            {"step": "Registration Done", "done": purchase_complete and plot.get("status") == "sold", "date": ""},
            {"step": "Possession Handed Over", "done": plot.get("status") == "sold" and purchase_complete, "date": ""},
        ]
        enriched.append({
            **plot,
            "property": prop,
            "payment_progress": progress,
            "total_amount": total_amt,
            "paid_amount": paid_amt,
            "balance_amount": total_amt - paid_amt,
            "purchase_complete": purchase_complete,
            "registration_timeline": timeline,
            "next_due": next((i for i in installments if i["status"] != "paid"), None),
        })
    return enriched


@api_router.get("/myland/can-request-services")
async def can_request_services(user: Dict[str, Any] = Depends(get_current_user)):
    """Returns whether user is eligible to request property services (owns at least one plot with sufficient progress)"""
    plots = await db.plots.find({"owner_id": user["id"]}, {"_id": 0}).to_list(100)
    if not plots:
        return {"eligible": False, "reason": "No properties purchased yet", "owned_plots": []}
    return {
        "eligible": True,
        "reason": None,
        "owned_plots": [{"id": p["id"], "plot_number": p["plot_number"], "property_id": p["property_id"]} for p in plots],
    }


# ---------- Payments ----------
@api_router.get("/payments/summary")
async def payments_summary(user: Dict[str, Any] = Depends(get_current_user)):
    installments = await db.installments.find({"user_id": user["id"]}, {"_id": 0}).to_list(200)
    total = sum(i["amount"] for i in installments)
    paid = sum(i["amount"] for i in installments if i["status"] == "paid")
    balance = total - paid
    today_iso = now_utc().date().isoformat()
    upcoming = [i for i in installments if i["status"] != "paid" and i["due_date"] >= today_iso]
    upcoming.sort(key=lambda x: x["due_date"])
    overdue = [i for i in installments if i["status"] != "paid" and i["due_date"] < today_iso]
    return {
        "total_cost": total,
        "amount_paid": paid,
        "balance": balance,
        "upcoming_installment": upcoming[0] if upcoming else None,
        "overdue_count": len(overdue),
        "total_installments": len(installments),
        "paid_count": len([i for i in installments if i["status"] == "paid"]),
    }


@api_router.get("/payments/installments")
async def list_installments(user: Dict[str, Any] = Depends(get_current_user)):
    items = await db.installments.find({"user_id": user["id"]}, {"_id": 0}).to_list(200)
    today_iso = now_utc().date().isoformat()
    # Auto-mark overdue
    for it in items:
        if it["status"] == "upcoming" and it["due_date"] < today_iso:
            it["status"] = "overdue"
    items.sort(key=lambda x: x["due_date"])
    return items


@api_router.get("/payments/history")
async def payment_history(user: Dict[str, Any] = Depends(get_current_user)):
    items = await db.payments.find({"user_id": user["id"]}, {"_id": 0}).sort("paid_at", -1).to_list(200)
    return items


@api_router.post("/payments/pay")
async def pay_installment(req: PayInstallmentReq, user: Dict[str, Any] = Depends(get_current_user)):
    inst = await db.installments.find_one({"id": req.installment_id, "user_id": user["id"]}, {"_id": 0})
    if not inst:
        raise HTTPException(status_code=404, detail="Installment not found")
    if inst["status"] == "paid":
        raise HTTPException(status_code=400, detail="Installment already paid")

    # Mock payment
    receipt_id = f"RCPT-{uuid.uuid4().hex[:8].upper()}"
    payment = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "installment_id": req.installment_id,
        "amount": inst["amount"],
        "receipt_id": receipt_id,
        "method": "Mock Online",
        "paid_at": now_utc().isoformat(),
        "installment_number": inst["installment_number"],
        "property_id": inst.get("property_id"),
    }
    await db.payments.insert_one(payment.copy())
    payment.pop("_id", None)
    await db.installments.update_one(
        {"id": req.installment_id},
        {"$set": {"status": "paid", "paid_at": now_utc().isoformat(), "receipt_id": receipt_id}}
    )

    await db.notifications.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "title": "Payment Successful",
        "body": f"Installment #{inst['installment_number']} of ₹{inst['amount']:,.0f} paid. Receipt: {receipt_id}",
        "type": "payment",
        "read": False,
        "created_at": now_utc().isoformat(),
    })
    return {"success": True, "payment": payment}


# ---------- Documents ----------
@api_router.get("/documents")
async def list_documents(user: Dict[str, Any] = Depends(get_current_user)):
    items = await db.documents.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return items


# ---------- Property Services ----------
SERVICE_CATALOG = [
    {"type": "Cleaning", "icon": "feather", "description": "Professional property cleaning"},
    {"type": "CCTV Installation", "icon": "video", "description": "Security camera setup"},
    {"type": "Compound Wall", "icon": "grid", "description": "Boundary wall construction"},
    {"type": "Construction", "icon": "tool", "description": "Custom construction services"},
    {"type": "Borewell", "icon": "droplet", "description": "Borewell drilling"},
    {"type": "Fencing", "icon": "shield", "description": "Property fencing"},
    {"type": "Electricity Connection", "icon": "zap", "description": "New connection setup"},
    {"type": "Water Connection", "icon": "droplet", "description": "Water connection setup"},
    {"type": "Property Maintenance", "icon": "settings", "description": "Routine maintenance"},
    {"type": "Legal Documentation", "icon": "file-text", "description": "Legal paperwork support"},
]


@api_router.get("/services/catalog")
async def services_catalog():
    return SERVICE_CATALOG


@api_router.post("/services/request")
async def request_service(req: ServiceReq, user: Dict[str, Any] = Depends(get_current_user)):
    # Gate: only owners (have at least one booked/sold plot) can request services
    owned = await db.plots.count_documents({"owner_id": user["id"]})
    if owned == 0:
        raise HTTPException(
            status_code=403,
            detail="Property services are available only after purchase. Please book a property first.",
        )
    sr = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "service_type": req.service_type,
        "property_id": req.property_id,
        "preferred_date": req.preferred_date,
        "description": req.description,
        "contact": req.contact,
        "status": "pending",
        "created_at": now_utc().isoformat(),
    }
    await db.service_requests.insert_one(sr.copy())
    sr.pop("_id", None)
    await db.notifications.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "title": "Service Requested",
        "body": f"Your {req.service_type} request has been received. Our team will contact you within 24 hours.",
        "type": "service",
        "read": False,
        "created_at": now_utc().isoformat(),
    })
    return {"success": True, "request": sr}


@api_router.get("/services/mine")
async def my_services(user: Dict[str, Any] = Depends(get_current_user)):
    items = await db.service_requests.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return items


# ---------- Experience Centres & Visits ----------
@api_router.get("/centres")
async def list_centres():
    items = await db.centres.find({}, {"_id": 0}).to_list(50)
    return items


@api_router.get("/centres/{centre_id}")
async def get_centre(centre_id: str):
    c = await db.centres.find_one({"id": centre_id}, {"_id": 0})
    if not c:
        raise HTTPException(status_code=404, detail="Centre not found")
    return c


@api_router.post("/visits/centre")
async def book_centre_visit(req: VisitBookingReq, user: Dict[str, Any] = Depends(get_current_user)):
    centre = await db.centres.find_one({"id": req.centre_id}, {"_id": 0})
    if not centre:
        raise HTTPException(status_code=404, detail="Centre not found")
    visit = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "type": "centre",
        "centre_id": req.centre_id,
        "centre_name": centre.get("name"),
        "visit_date": req.visit_date,
        "visit_time": req.visit_time,
        "name": req.name,
        "mobile": req.mobile,
        "status": "confirmed",
        "created_at": now_utc().isoformat(),
    }
    await db.visits.insert_one(visit.copy())
    visit.pop("_id", None)
    await db.notifications.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "title": "Centre Visit Confirmed",
        "body": f"Your visit to {centre.get('name')} on {req.visit_date} at {req.visit_time} is confirmed.",
        "type": "visit",
        "read": False,
        "created_at": now_utc().isoformat(),
    })
    return {"success": True, "visit": visit}


@api_router.post("/visits/site")
async def book_site_visit(req: SiteVisitReq, user: Dict[str, Any] = Depends(get_current_user)):
    prop = await db.properties.find_one({"id": req.property_id}, {"_id": 0})
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    visit = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "type": "site",
        "property_id": req.property_id,
        "property_name": prop.get("name"),
        "visit_date": req.visit_date,
        "name": req.name,
        "mobile": req.mobile,
        "status": "confirmed",
        "created_at": now_utc().isoformat(),
    }
    await db.visits.insert_one(visit.copy())
    visit.pop("_id", None)
    await db.notifications.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "title": "Site Visit Scheduled",
        "body": f"Your visit to {prop.get('name')} on {req.visit_date} is scheduled.",
        "type": "visit",
        "read": False,
        "created_at": now_utc().isoformat(),
    })
    return {"success": True, "visit": visit}


@api_router.get("/visits/mine")
async def my_visits(user: Dict[str, Any] = Depends(get_current_user)):
    items = await db.visits.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return items


# ---------- Wishlist ----------
@api_router.post("/wishlist/toggle")
async def toggle_wishlist(req: WishlistReq, user: Dict[str, Any] = Depends(get_current_user)):
    existing = await db.wishlist.find_one({"user_id": user["id"], "property_id": req.property_id})
    if existing:
        await db.wishlist.delete_one({"user_id": user["id"], "property_id": req.property_id})
        return {"wishlisted": False}
    await db.wishlist.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "property_id": req.property_id,
        "created_at": now_utc().isoformat(),
    })
    return {"wishlisted": True}


@api_router.get("/wishlist")
async def get_wishlist(user: Dict[str, Any] = Depends(get_current_user)):
    items = await db.wishlist.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    pids = [i["property_id"] for i in items]
    props = await db.properties.find({"id": {"$in": pids}}, {"_id": 0}).to_list(100)
    return props


# ---------- Notifications ----------
@api_router.get("/notifications")
async def list_notifications(user: Dict[str, Any] = Depends(get_current_user)):
    items = await db.notifications.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return items


@api_router.post("/notifications/{notif_id}/read")
async def read_notification(notif_id: str, user: Dict[str, Any] = Depends(get_current_user)):
    await db.notifications.update_one(
        {"id": notif_id, "user_id": user["id"]},
        {"$set": {"read": True}}
    )
    return {"success": True}


@api_router.post("/notifications/read-all")
async def read_all_notifications(user: Dict[str, Any] = Depends(get_current_user)):
    await db.notifications.update_many(
        {"user_id": user["id"], "read": False},
        {"$set": {"read": True}}
    )
    return {"success": True}


# ---------- Admin ----------
@api_router.get("/admin/stats")
async def admin_stats(user: Dict[str, Any] = Depends(get_admin_user)):
    return {
        "users": await db.users.count_documents({}),
        "properties": await db.properties.count_documents({}),
        "plots": await db.plots.count_documents({}),
        "plots_sold": await db.plots.count_documents({"status": "sold"}),
        "plots_booked": await db.plots.count_documents({"status": "booked"}),
        "plots_reserved": await db.plots.count_documents({"status": "reserved"}),
        "plots_available": await db.plots.count_documents({"status": "available"}),
        "bookings": await db.bookings.count_documents({}),
        "service_requests": await db.service_requests.count_documents({}),
        "visits": await db.visits.count_documents({}),
    }


@api_router.get("/admin/users")
async def admin_users(user: Dict[str, Any] = Depends(get_admin_user)):
    return await db.users.find({}, {"_id": 0}).to_list(500)


@api_router.get("/admin/bookings")
async def admin_bookings(user: Dict[str, Any] = Depends(get_admin_user)):
    items = await db.bookings.find({}, {"_id": 0}).to_list(500)
    items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return items


@api_router.post("/admin/bookings/{booking_id}/confirm")
async def admin_confirm_booking(booking_id: str, user: Dict[str, Any] = Depends(get_admin_user)):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    await db.bookings.update_one({"id": booking_id}, {"$set": {"status": "confirmed"}})
    await db.plots.update_one(
        {"id": booking["plot_id"]},
        {"$set": {"status": "booked", "owner_id": booking["user_id"]}}
    )
    return {"success": True}


@api_router.get("/admin/service-requests")
async def admin_services(user: Dict[str, Any] = Depends(get_admin_user)):
    items = await db.service_requests.find({}, {"_id": 0}).to_list(500)
    items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return items


@api_router.post("/admin/service-requests/{req_id}/status")
async def admin_update_service_status(req_id: str, status_val: str = Query(...), user: Dict[str, Any] = Depends(get_admin_user)):
    if status_val not in ("pending", "in_progress", "completed"):
        raise HTTPException(status_code=400, detail="Invalid status")
    await db.service_requests.update_one({"id": req_id}, {"$set": {"status": status_val}})
    return {"success": True}


@api_router.post("/admin/properties")
async def admin_create_property(req: AdminPropertyReq, user: Dict[str, Any] = Depends(get_admin_user)):
    prop = {
        "id": str(uuid.uuid4()),
        **req.dict(),
        "images": [req.image],
        "featured": False,
        "availability": "Available",
        "created_at": now_utc().isoformat(),
    }
    await db.properties.insert_one(prop.copy())
    prop.pop("_id", None)
    return prop


# ---------- Seed Data ----------
async def seed_data():
    existing_property_count = await db.properties.count_documents({})
    legacy_region_property_count = await db.properties.count_documents({
        "$nor": [
            {"location": {"$regex": "Vizag", "$options": "i"}},
            {"location": {"$regex": "Vijayawada", "$options": "i"}},
        ],
    })
    if existing_property_count > 0 and legacy_region_property_count == 0:
        logger.info("Database already seeded, skipping.")
        return
    if legacy_region_property_count > 0:
        logger.info("Replacing legacy regional seed data with Vizag/Vijayawada seed data...")
        await db.properties.delete_many({})
        await db.plots.delete_many({})
        await db.centres.delete_many({})
        await db.bookings.delete_many({})
        await db.installments.delete_many({"id": {"$regex": "^inst-demo-"}})
        await db.payments.delete_many({"id": {"$regex": "^pay-demo-"}})
        await db.documents.delete_many({"user_id": "demo-user-001"})
        await db.notifications.delete_many({"user_id": "demo-user-001"})
        await db.users.delete_many({"id": {"$in": ["demo-user-001", "admin-user-001"]}})

    logger.info("Seeding initial data...")

    # ---- Properties ----
    properties = [
        {
            "id": "prop-1",
            "name": "Rivan Madhurawada Plots",
            "category": "Open Plots",
            "location": "Madhurawada, Vizag",
            "starting_price": 1850000,
            "size": "200-600 sq yards",
            "image": "https://images.unsplash.com/photo-1677137263546-8695fb895a9d",
            "images": [
                "https://images.unsplash.com/photo-1677137263546-8695fb895a9d",
                "https://images.pexels.com/photos/15422584/pexels-photo-15422584.jpeg",
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
            ],
            "description": "Premium gated community plots in North Vizag with excellent connectivity to Madhurawada, PM Palem and Anandapuram.",
            "survey_number": "VSP-MP-234/3, 235/1",
            "facing": "East / North",
            "road_width": "40 ft black-top",
            "availability": "Available",
            "featured": True,
            "amenities": ["Clubhouse", "Swimming Pool", "Gym", "Children's Park", "24/7 Security", "Underground Drainage", "Avenue Plantation"],
            "approvals": ["VUDA Zone", "RERA Registered", "Clear Title", "Vasthu Compliant"],
            "nearby": ["Madhurawada - 2km", "PM Palem - 5min", "Anandapuram Junction - 12min", "Schools - 5min"],
            "highlights": "North Vizag growth corridor · Gated community · Investment grade",
            "created_at": now_utc().isoformat(),
        },
        {
            "id": "prop-2",
            "name": "Rivan Rushikonda Villas",
            "category": "Villas",
            "location": "Rushikonda, Vizag",
            "starting_price": 14500000,
            "size": "2400-3800 sq ft",
            "image": "https://images.pexels.com/photos/29334668/pexels-photo-29334668.png",
            "images": [
                "https://images.pexels.com/photos/29334668/pexels-photo-29334668.png",
                "https://images.unsplash.com/photo-1626249893783-cc4a9f66880a",
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
            ],
            "description": "Luxury 4 BHK villas near Rushikonda with private gardens, premium finishes and access to the beach corridor.",
            "survey_number": "VSP-RV-89/2, 90",
            "facing": "East",
            "road_width": "60 ft",
            "availability": "Available",
            "featured": True,
            "amenities": ["Private Pool", "Garden", "Servant Quarter", "Italian Marble", "Modular Kitchen", "Smart Home"],
            "approvals": ["VUDA Zone", "RERA Registered", "Bank Loan Approved"],
            "nearby": ["Rushikonda Beach - 5min", "IT SEZ - 10min", "Gitam University - 8min"],
            "highlights": "Premium 4 BHK · Coastal villa community · Smart home",
            "created_at": now_utc().isoformat(),
        },
        {
            "id": "prop-3",
            "name": "Rivan Coastal Heights",
            "category": "Apartments",
            "location": "MVP Colony, Vizag",
            "starting_price": 8500000,
            "size": "1450-2200 sq ft",
            "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
            "images": [
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
            ],
            "description": "Premium 3 BHK apartments close to schools, hospitals and the Vizag beach corridor.",
            "survey_number": "VSP-CH-11/1",
            "facing": "North-East",
            "road_width": "100 ft main road",
            "availability": "Available",
            "featured": True,
            "amenities": ["Infinity Pool", "Sky Lounge", "Gym", "Co-working Space", "Pet Park", "EV Charging"],
            "approvals": ["VUDA Zone", "RERA Registered"],
            "nearby": ["MVP Colony - 1km", "Beach Road - 10min", "Siripuram - 12min"],
            "highlights": "3 BHK · Beach-city living · Sky lounge",
            "created_at": now_utc().isoformat(),
        },
        {
            "id": "prop-4",
            "name": "Rivan Coastal Farms",
            "category": "Farm Lands",
            "location": "Anandapuram, Vizag",
            "starting_price": 3500000,
            "size": "1-5 acres",
            "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
            "images": [
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
                "https://images.unsplash.com/photo-1444858345236-d791f5d20245",
            ],
            "description": "Premium managed farm lands near Anandapuram with mango and teak plantation options.",
            "survey_number": "VSP-CF-156, 157",
            "facing": "Multiple",
            "road_width": "30 ft",
            "availability": "Available",
            "featured": False,
            "amenities": ["Managed Farming", "Cottage", "Borewell", "Drip Irrigation", "Solar Power"],
            "approvals": ["Agriculture Clearance", "Clear Title"],
            "nearby": ["Anandapuram Junction - 8km", "Bheemili Road - 20min"],
            "highlights": "Managed farm · Cottage included · Plantation option",
            "created_at": now_utc().isoformat(),
        },
        {
            "id": "prop-5",
            "name": "Rivan Benz Circle Business Park",
            "category": "Commercial Properties",
            "location": "Benz Circle, Vijayawada",
            "starting_price": 12000000,
            "size": "800-3500 sq ft",
            "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
            "images": [
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
                "https://images.unsplash.com/photo-1497366216548-37526070297c",
            ],
            "description": "Grade A commercial spaces in a high-visibility Vijayawada business location.",
            "survey_number": "VJA-BC-22/1",
            "facing": "South-West",
            "road_width": "100 ft",
            "availability": "Available",
            "featured": False,
            "amenities": ["High-speed Elevators", "100% Power Backup", "Centralized AC", "Smart Parking"],
            "approvals": ["Commercial Use Approved", "RERA Registered"],
            "nearby": ["Benz Circle - 500m", "MG Road - 1km", "Auto Nagar - 10min"],
            "highlights": "Grade A · Benz Circle · Business-ready",
            "created_at": now_utc().isoformat(),
        },
        {
            "id": "prop-6",
            "name": "Rivan Riverfront Plots",
            "category": "Layouts",
            "location": "Gannavaram, Vijayawada",
            "starting_price": 2200000,
            "size": "150-500 sq yards",
            "image": "https://images.pexels.com/photos/15422584/pexels-photo-15422584.jpeg",
            "images": [
                "https://images.pexels.com/photos/15422584/pexels-photo-15422584.jpeg",
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
            ],
            "description": "Well-connected residential plots near the Vijayawada airport and emerging growth belt.",
            "survey_number": "VJA-RP-78/2, 79",
            "facing": "Multiple",
            "road_width": "40 ft",
            "availability": "Available",
            "featured": True,
            "amenities": ["Avenue Plantation", "Underground Drainage", "Street Lights", "Park"],
            "approvals": ["CRDA Zone", "RERA Registered"],
            "nearby": ["Gannavaram Airport - 10min", "NH16 - 5min", "Autonagar - 15min"],
            "highlights": "Airport corridor · Premium layout · Clear title",
            "created_at": now_utc().isoformat(),
        },
        {
            "id": "prop-7",
            "name": "Rivan Amaravati Avenue",
            "category": "Flats",
            "location": "Amaravati, Vijayawada",
            "starting_price": 5800000,
            "size": "1100-1650 sq ft",
            "image": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
            "images": [
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
            ],
            "description": "2 & 3 BHK premium flats near the Amaravati capital region with modern amenities.",
            "survey_number": "VJA-AA-45/1",
            "facing": "East / West",
            "road_width": "60 ft",
            "availability": "Available",
            "featured": False,
            "amenities": ["Swimming Pool", "Gym", "Kids Play Area", "Yoga Deck", "Visitor Parking"],
            "approvals": ["CRDA Zone", "RERA Registered"],
            "nearby": ["Amaravati - 10min", "Tadepalli - 15min", "Undavalli - 15min"],
            "highlights": "2/3 BHK · Capital-region access · Investment",
            "created_at": now_utc().isoformat(),
        },
    ]
    await db.properties.insert_many([p.copy() for p in properties])

    # ---- Plots for Rivan Madhurawada Plots (interactive layout) ----
    plot_statuses = ["available"] * 10 + ["reserved"] * 4 + ["booked"] * 4 + ["sold"] * 6
    facings = ["East", "West", "North", "South", "North-East", "South-East"]
    plots = []
    plot_num = 1
    for row in range(6):
        for col in range(4):
            idx = row * 4 + col
            if idx >= 24:
                break
            size_sqy = [200, 240, 300, 360][col]
            price = size_sqy * 9250
            plots.append({
                "id": f"plot-1-{plot_num}",
                "property_id": "prop-1",
                "unit_type": "plot",
                "plot_number": f"P-{plot_num:03d}",
                "survey_number": "VSP-MP-234/3",
                "size": f"{size_sqy} sq yards",
                "size_sqy": size_sqy,
                "facing": facings[idx % len(facings)],
                "price": price,
                "status": plot_statuses[idx % len(plot_statuses)],
                "row": row,
                "col": col,
                "owner_id": None,
                "created_at": now_utc().isoformat(),
            })
            plot_num += 1
    await db.plots.insert_many([p.copy() for p in plots])

    # ---- Plots for Rivan Riverfront Plots ----
    plots2 = []
    plot_num = 1
    for row in range(5):
        for col in range(4):
            idx = row * 4 + col
            size_sqy = [150, 200, 300, 500][col]
            price = size_sqy * 11000
            status_choice = ["available", "available", "available", "reserved", "booked", "sold"][idx % 6]
            plots2.append({
                "id": f"plot-6-{plot_num}",
                "property_id": "prop-6",
                "unit_type": "plot",
                "plot_number": f"L-{plot_num:03d}",
                "survey_number": "VJA-RP-78/2",
                "size": f"{size_sqy} sq yards",
                "size_sqy": size_sqy,
                "facing": facings[idx % len(facings)],
                "price": price,
                "status": status_choice,
                "row": row,
                "col": col,
                "owner_id": None,
                "created_at": now_utc().isoformat(),
            })
            plot_num += 1
    await db.plots.insert_many([p.copy() for p in plots2])

    # ---- Apartment Units for Rivan Coastal Heights (prop-3) ----
    # 2 towers × 8 floors × 4 flats per floor = 64 units
    apt_units = []
    flat_status_pool = ["available"] * 5 + ["reserved", "booked", "sold"]
    for tower_idx, tower in enumerate(["T1", "T2"]):
        for floor in range(1, 9):
            for flat in range(1, 5):
                size_sqft = [1450, 1750, 1950, 2200][flat - 1]
                bhk = ["3 BHK", "3 BHK", "3.5 BHK", "4 BHK"][flat - 1]
                price = size_sqft * 5862  # ~₹85L starting
                idx_local = tower_idx * 32 + (floor - 1) * 4 + (flat - 1)
                apt_units.append({
                    "id": f"flat-3-{tower}-F{floor:02d}-{flat:02d}",
                    "property_id": "prop-3",
                    "unit_type": "flat",
                    "plot_number": f"{tower}-{floor:02d}0{flat}",
                    "survey_number": "VSP-CH-11/1",
                    "tower": tower,
                    "floor": floor,
                    "flat_number": f"{tower}-{floor:02d}0{flat}",
                    "bhk": bhk,
                    "size": f"{size_sqft} sq ft",
                    "size_sqft": size_sqft,
                    "facing": ["North-East", "South-East", "North-West", "South-West"][flat - 1],
                    "price": price,
                    "status": flat_status_pool[idx_local % len(flat_status_pool)],
                    "row": floor,
                    "col": flat,
                    "owner_id": None,
                    "created_at": now_utc().isoformat(),
                })
    await db.plots.insert_many([u.copy() for u in apt_units])

    # ---- Villa Units for Rivan Rushikonda Villas (prop-2) ----
    villa_units = []
    villa_status_pool = ["available", "available", "available", "reserved", "booked", "sold"]
    for i in range(1, 13):
        size_sqft = [2400, 2800, 3200, 3800][((i - 1) % 4)]
        villa_type = ["Classic 4 BHK", "Premium 4 BHK", "Luxury 4.5 BHK", "Signature 5 BHK"][((i - 1) % 4)]
        price = size_sqft * 6041  # ~₹1.45 Cr starting
        villa_units.append({
            "id": f"villa-2-{i:02d}",
            "property_id": "prop-2",
            "unit_type": "villa",
            "plot_number": f"V-{i:02d}",
            "survey_number": "VSP-RV-89/2",
            "villa_type": villa_type,
            "size": f"{size_sqft} sq ft",
            "size_sqft": size_sqft,
            "facing": facings[i % len(facings)],
            "price": price,
            "status": villa_status_pool[i % len(villa_status_pool)],
            "row": (i - 1) // 4,
            "col": (i - 1) % 4,
            "owner_id": None,
            "created_at": now_utc().isoformat(),
        })
    await db.plots.insert_many([v.copy() for v in villa_units])

    # ---- Commercial Units for Rivan Benz Circle Business Park (prop-5) ----
    commercial_units = []
    cm_status_pool = ["available", "available", "reserved", "booked", "sold"]
    for floor in range(1, 6):
        for shop in range(1, 5):
            idx_c = (floor - 1) * 4 + (shop - 1)
            size_sqft = [800, 1200, 2000, 3500][shop - 1]
            shop_type = ["Retail", "Retail", "Office", "Office"][shop - 1]
            price = size_sqft * 14400  # ~₹1.15 Cr starting
            commercial_units.append({
                "id": f"shop-5-F{floor:02d}-{shop:02d}",
                "property_id": "prop-5",
                "unit_type": "shop",
                "plot_number": f"F{floor}-S{shop:02d}",
                "survey_number": "VJA-BC-22/1",
                "floor": floor,
                "shop_type": shop_type,
                "size": f"{size_sqft} sq ft",
                "size_sqft": size_sqft,
                "facing": ["East", "West", "North", "South"][shop - 1],
                "price": price,
                "status": cm_status_pool[idx_c % len(cm_status_pool)],
                "row": floor,
                "col": shop,
                "owner_id": None,
                "created_at": now_utc().isoformat(),
            })
    await db.plots.insert_many([c.copy() for c in commercial_units])

    # ---- Farm Land Parcels for Rivan Coastal Farms (prop-4) ----
    farm_units = []
    farm_status_pool = ["available", "available", "reserved", "booked", "sold"]
    for i in range(1, 9):
        acres = [1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 5.0][i - 1]
        price = int(acres * 3500000)
        farm_units.append({
            "id": f"farm-4-{i:02d}",
            "property_id": "prop-4",
            "unit_type": "farm",
            "plot_number": f"FL-{i:02d}",
            "survey_number": "VSP-CF-156",
            "acres": acres,
            "size": f"{acres} acres",
            "facing": facings[i % len(facings)],
            "price": price,
            "status": farm_status_pool[i % len(farm_status_pool)],
            "row": (i - 1) // 4,
            "col": (i - 1) % 4,
            "owner_id": None,
            "created_at": now_utc().isoformat(),
        })
    await db.plots.insert_many([f.copy() for f in farm_units])

    # ---- Flats for Rivan Amaravati Avenue (prop-7) ----
    pflat_units = []
    pf_status_pool = ["available"] * 4 + ["reserved", "booked", "sold"]
    for tower_idx, tower in enumerate(["A", "B"]):
        for floor in range(1, 7):
            for flat in range(1, 4):
                size_sqft = [1100, 1350, 1650][flat - 1]
                bhk = ["2 BHK", "3 BHK", "3 BHK"][flat - 1]
                price = size_sqft * 5273
                idx_pf = tower_idx * 18 + (floor - 1) * 3 + (flat - 1)
                pflat_units.append({
                    "id": f"flat-7-{tower}-F{floor:02d}-{flat:02d}",
                    "property_id": "prop-7",
                    "unit_type": "flat",
                    "plot_number": f"{tower}-{floor:02d}0{flat}",
                    "survey_number": "VJA-AA-45/1",
                    "tower": tower,
                    "floor": floor,
                    "flat_number": f"{tower}-{floor:02d}0{flat}",
                    "bhk": bhk,
                    "size": f"{size_sqft} sq ft",
                    "size_sqft": size_sqft,
                    "facing": ["East", "West", "North"][flat - 1],
                    "price": price,
                    "status": pf_status_pool[idx_pf % len(pf_status_pool)],
                    "row": floor,
                    "col": flat,
                    "owner_id": None,
                    "created_at": now_utc().isoformat(),
                })
    await db.plots.insert_many([u.copy() for u in pflat_units])

    # ---- Experience Centres ----
    centres = [
        {
            "id": "centre-1",
            "name": "Rivan Vizag Experience Centre",
            "address": "MVP Colony, Visakhapatnam, Andhra Pradesh",
            "phone": "+91-9876543210",
            "whatsapp": "+91-9876543210",
            "timings": "10:00 AM - 7:00 PM (Mon-Sun)",
            "manager": "Mr. Karthik Reddy",
            "image": "https://images.pexels.com/photos/7534173/pexels-photo-7534173.jpeg",
            "latitude": 17.7439,
            "longitude": 83.3250,
            "directions_url": "https://maps.google.com/?q=MVP+Colony+Visakhapatnam",
        },
        {
            "id": "centre-2",
            "name": "Rivan Vijayawada Experience Centre",
            "address": "Benz Circle, Vijayawada, Andhra Pradesh",
            "phone": "+91-9876543211",
            "whatsapp": "+91-9876543211",
            "timings": "10:00 AM - 8:00 PM (Mon-Sun)",
            "manager": "Mrs. Priya Sharma",
            "image": "https://images.unsplash.com/photo-1497366216548-37526070297c",
            "latitude": 16.5010,
            "longitude": 80.6540,
            "directions_url": "https://maps.google.com/?q=Benz+Circle+Vijayawada",
        },
        {
            "id": "centre-3",
            "name": "Rivan Rushikonda Site Office",
            "address": "Rushikonda, Visakhapatnam, Andhra Pradesh",
            "phone": "+91-9876543212",
            "whatsapp": "+91-9876543212",
            "timings": "9:00 AM - 6:00 PM (Mon-Sat)",
            "manager": "Mr. Suresh Babu",
            "image": "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
            "latitude": 17.7827,
            "longitude": 83.3762,
            "directions_url": "https://maps.google.com/?q=Rushikonda+Visakhapatnam",
        },
    ]
    await db.centres.insert_many([c.copy() for c in centres])

    # ---- Demo user with land + installments + documents ----
    demo_user_id = "demo-user-001"
    await db.users.insert_one({
        "id": demo_user_id,
        "phone": "9999900001",
        "name": "Rajesh Kumar",
        "email": "rajesh.demo@rivanreality.com",
        "address": "MVP Colony, Visakhapatnam",
        "kyc_status": "verified",
        "is_admin": False,
        "created_at": now_utc().isoformat(),
    })

    # Assign a plot to demo user
    demo_plot_id = "plot-1-5"
    await db.plots.update_one(
        {"id": demo_plot_id},
        {"$set": {"status": "booked", "owner_id": demo_user_id}}
    )

    # Assign a SECOND plot to demo user — fully purchased (for "Purchase Completed" demo state)
    completed_plot_id = "villa-2-03"
    await db.plots.update_one(
        {"id": completed_plot_id},
        {"$set": {"status": "sold", "owner_id": demo_user_id}}
    )

    # Installments for demo
    total_property = 2775000  # 300 sqy * 9250
    installment_amount = total_property / 12
    base_date = now_utc().date()
    installments = []
    for i in range(1, 13):
        due = base_date + timedelta(days=30 * (i - 4))  # 3 past, 9 future
        status_val = "paid" if i <= 3 else "upcoming"
        installments.append({
            "id": f"inst-demo-{i}",
            "user_id": demo_user_id,
            "property_id": "prop-1",
            "plot_id": demo_plot_id,
            "installment_number": i,
            "amount": installment_amount,
            "due_date": due.isoformat(),
            "status": status_val,
            "paid_at": (now_utc() - timedelta(days=30 * (4 - i))).isoformat() if i <= 3 else None,
            "receipt_id": f"RCPT-DEMO{i:03d}" if i <= 3 else None,
            "created_at": now_utc().isoformat(),
        })
    await db.installments.insert_many([i.copy() for i in installments])

    # Past payments for demo
    for i in range(1, 4):
        await db.payments.insert_one({
            "id": f"pay-demo-{i}",
            "user_id": demo_user_id,
            "installment_id": f"inst-demo-{i}",
            "amount": installment_amount,
            "receipt_id": f"RCPT-DEMO{i:03d}",
            "method": "Online (UPI)",
            "paid_at": (now_utc() - timedelta(days=30 * (4 - i))).isoformat(),
            "installment_number": i,
            "property_id": "prop-1",
        })

    # Documents for demo
    demo_docs = [
        {"name": "Sale Agreement", "type": "Agreement", "size": "1.2 MB"},
        {"name": "Plot Allocation Letter", "type": "Letter", "size": "320 KB"},
        {"name": "Payment Receipt #1", "type": "Receipt", "size": "180 KB"},
        {"name": "Payment Receipt #2", "type": "Receipt", "size": "180 KB"},
        {"name": "Payment Receipt #3", "type": "Receipt", "size": "180 KB"},
        {"name": "KYC - PAN Card", "type": "KYC", "size": "220 KB"},
        {"name": "KYC - Aadhaar", "type": "KYC", "size": "340 KB"},
        {"name": "Regional Approval Copy", "type": "Approval", "size": "2.1 MB"},
        {"name": "Sale Deed Draft", "type": "Deed", "size": "850 KB"},
    ]
    for d in demo_docs:
        await db.documents.insert_one({
            "id": str(uuid.uuid4()),
            "user_id": demo_user_id,
            "name": d["name"],
            "type": d["type"],
            "size": d["size"],
            "url": "https://www.africau.edu/images/default/sample.pdf",
            "created_at": now_utc().isoformat(),
        })

    # Notifications for demo
    demo_notifs = [
        ("Welcome to Rivan Reality", "Legacy of trust, legacy of wealth.", "welcome"),
        ("Installment Due Reminder", f"Your next installment of ₹{installment_amount:,.0f} is due soon.", "payment"),
        ("New Layout Launched", "Rivan Riverfront Plots — bookings open now!", "project"),
        ("Document Uploaded", "Your sale deed draft has been uploaded to the document locker.", "document"),
    ]
    for title, body, ntype in demo_notifs:
        await db.notifications.insert_one({
            "id": str(uuid.uuid4()),
            "user_id": demo_user_id,
            "title": title,
            "body": body,
            "type": ntype,
            "read": False,
            "created_at": now_utc().isoformat(),
        })

    # ---- Admin user ----
    await db.users.insert_one({
        "id": "admin-user-001",
        "phone": "9000000000",
        "name": "Rivan Admin",
        "email": "admin@rivanreality.com",
        "address": "Rivan Regional Office, Vijayawada",
        "kyc_status": "verified",
        "is_admin": True,
        "created_at": now_utc().isoformat(),
    })

    logger.info("Seed data inserted successfully.")


# ---------- Lifecycle ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials="*" not in CORS_ORIGINS,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)
