// Supabase-backed API compatibility layer for the Expo app.
import { supabase } from "@/src/supabase";

const DEV_OTP = process.env.EXPO_PUBLIC_SUPABASE_DEV_OTP || "123456";
const LOGOUT_MARKER_KEY = "logout_marker";

const SERVICE_CATALOG = [
  { type: "Cleaning", icon: "feather", description: "Professional property cleaning" },
  { type: "CCTV Installation", icon: "video", description: "Security camera setup" },
  { type: "Compound Wall", icon: "grid", description: "Boundary wall construction" },
  { type: "Construction", icon: "tool", description: "Custom construction services" },
  { type: "Borewell", icon: "droplet", description: "Borewell drilling" },
  { type: "Fencing", icon: "shield", description: "Property fencing" },
  { type: "Electricity Connection", icon: "zap", description: "New connection setup" },
  { type: "Water Connection", icon: "droplet", description: "Water connection setup" },
  { type: "Property Maintenance", icon: "settings", description: "Routine maintenance" },
  { type: "Legal Documentation", icon: "file-text", description: "Legal paperwork support" },
];

const CENTRES = [
  {
    id: "centre-hyd",
    name: "Rivan Experience Centre",
    address: "Jubilee Hills, Hyderabad",
    timings: "10:00 AM - 7:00 PM",
    manager: "Rivan Team",
    phone: "+91 9876543210",
    whatsapp: "+91 9876543210",
    directions_url: "https://maps.google.com/?q=Hyderabad",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
  },
];

function assertSupabaseEnv() {
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase env vars are missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.");
  }
}

function normalizePhone(phone: string) {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits.slice(-10);
}

function e164(phone: string) {
  return `+91${normalizePhone(phone)}`;
}

function hasLogoutMarker() {
  if (typeof window === "undefined") return false;
  return window.localStorage?.getItem(LOGOUT_MARKER_KEY) === "1" ||
    window.sessionStorage?.getItem(LOGOUT_MARKER_KEY) === "1";
}

function clearLogoutMarker() {
  if (typeof window === "undefined") return;
  window.localStorage?.removeItem(LOGOUT_MARKER_KEY);
  window.sessionStorage?.removeItem(LOGOUT_MARKER_KEY);
}

export function markLoggedOut() {
  if (typeof window === "undefined") return;
  window.localStorage?.setItem(LOGOUT_MARKER_KEY, "1");
  window.sessionStorage?.setItem(LOGOUT_MARKER_KEY, "1");
  console.log("[auth-flow] logout marker set");
}

export async function getToken(): Promise<string | null> {
  if (hasLogoutMarker()) {
    console.log("[auth-flow] getToken blocked by logout marker");
    return null;
  }
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

export async function setToken(_token: string) {
  clearLogoutMarker();
}

export async function clearToken() {
  await supabase.auth.signOut();
}

export async function setStoredUser(_user: any) {
  clearLogoutMarker();
}

export async function clearAuthData() {
  markLoggedOut();
  await supabase.auth.signOut();
  console.log("auth storage cleared");
}

async function currentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || hasLogoutMarker()) return null;
  return data.user;
}

async function requireUser() {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}

async function upsertProfile(userId: string, phone: string, name?: string) {
  const payload = {
    id: userId,
    phone: normalizePhone(phone),
    name: name || `User-${normalizePhone(phone).slice(-4)}`,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

function mapProfile(profile: any) {
  return {
    id: profile.id,
    phone: profile.phone || "",
    name: profile.name || `User-${(profile.phone || "").slice(-4)}`,
    email: profile.email || "",
    address: profile.address || "",
    kyc_status: profile.kyc_status || "pending",
    is_admin: !!profile.is_admin,
    created_at: profile.created_at,
  };
}

function mapProperty(p: any) {
  const imageRows = p.property_images || [];
  const images = imageRows
    .slice()
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((img: any) => img.url);
  return {
    ...p,
    image: p.image || images[0],
    images: images.length ? images : (p.image ? [p.image] : []),
  };
}

function propertiesQuery() {
  return supabase
    .from("properties")
    .select("*, property_images(id, url, alt_text, sort_order)")
    .order("created_at", { ascending: false });
}

function mapPayment(row: any) {
  return {
    ...row,
    status: row.status || "pending",
    receipt_id: row.receipt_id || row.id,
    method: row.method || "Online",
    installment_number: row.installment_number || 1,
  };
}

function mapService(row: any) {
  const serviceType = typeof row.source === "string" && row.source.startsWith("service:")
    ? row.source.replace("service:", "")
    : row.service_type || "Service Request";
  return {
    ...row,
    service_type: serviceType,
    description: row.message || row.description || "",
    preferred_date: row.metadata?.preferred_date || row.created_at?.slice(0, 10) || "",
  };
}

export const api = {
  sendOtp: async (phone: string) => {
    assertSupabaseEnv();
    const cleaned = normalizePhone(phone);
    if (cleaned.length !== 10) throw new Error("Invalid phone number");
    const { error } = await supabase.auth.signInWithOtp({ phone: e164(cleaned) });
    if (error) {
      console.warn("Supabase phone OTP unavailable, falling back to local dev OTP.", error.message);
      return { success: true, dev_otp: DEV_OTP, message: `Dev OTP: ${DEV_OTP}`, dev_mode: true };
    }
    return { success: true, message: "OTP sent. Check your phone.", dev_otp: DEV_OTP };
  },

  verifyOtp: async (phone: string, otp: string, name?: string) => {
    assertSupabaseEnv();
    const cleaned = normalizePhone(phone);
    clearLogoutMarker();
    let authUserId = "";
    let accessToken = "";

    const verified = await supabase.auth.verifyOtp({ phone: e164(cleaned), token: otp, type: "sms" });
    if (!verified.error && verified.data.user) {
      authUserId = verified.data.user.id;
      accessToken = verified.data.session?.access_token || "";
    } else if (otp === DEV_OTP) {
      const anon = await supabase.auth.signInAnonymously();
      if (anon.error || !anon.data.user) {
        throw new Error("Supabase phone OTP failed and anonymous dev login is not enabled.");
      }
      authUserId = anon.data.user.id;
      accessToken = anon.data.session?.access_token || "";
    } else {
      throw new Error(verified.error?.message || "Invalid OTP");
    }

    const profile = await upsertProfile(authUserId, cleaned, name);
    return { access_token: accessToken, user: mapProfile(profile) };
  },

  me: async () => {
    const user = await requireUser();
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (error) throw new Error(error.message);
    return mapProfile(data);
  },

  updateProfile: async (data: any) => {
    const user = await requireUser();
    const { data: profile, error } = await supabase
      .from("profiles")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapProfile(profile);
  },

  listProperties: async (filters?: any) => {
    let query = propertiesQuery();
    if (filters?.category) query = query.eq("category", filters.category);
    if (filters?.location) query = query.ilike("location", `%${filters.location}%`);
    if (filters?.min_price) query = query.gte("starting_price", filters.min_price);
    if (filters?.max_price) query = query.lte("starting_price", filters.max_price);
    if (filters?.search) {
      const search = `%${filters.search}%`;
      query = query.or(`name.ilike.${search},location.ilike.${search},description.ilike.${search}`);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map(mapProperty);
  },
  featured: async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("*, property_images(id, url, alt_text, sort_order)")
      .eq("featured", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(mapProperty);
  },
  getProperty: async (id: string) => {
    const { data, error } = await supabase
      .from("properties")
      .select("*, property_images(id, url, alt_text, sort_order)")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return mapProperty(data);
  },
  getPropertyPlots: async (_id: string) => [],
  getPlot: async (id: string) => {
    const property = await api.getProperty(id);
    return { ...property, plot_number: property.name, status: "available", property_id: property.id, price: property.starting_price };
  },

  createBooking: async (body: any) => {
    const user = await currentUser();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        user_id: user?.id || null,
        property_id: body.property_id || body.plot_id || null,
        name: body.name,
        phone: body.mobile,
        message: body.message,
        source: "booking",
        status: "new",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { success: true, booking: data, message: "Thank you. Our Rivan team will contact you shortly." };
  },
  myBookings: async () => [],
  myLand: async () => [],
  canRequestServices: async () => ({ eligible: false, reason: "Property service requests will be enabled after Supabase ownership data is connected.", owned_plots: [] }),

  paymentsSummary: async () => {
    const user = await requireUser();
    const { data, error } = await supabase.from("payments").select("*").eq("user_id", user.id);
    if (error) throw new Error(error.message);
    const total = (data || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const paid = (data || []).filter((p) => p.status === "paid").reduce((sum, p) => sum + Number(p.amount || 0), 0);
    return { total_cost: total, amount_paid: paid, balance: total - paid, upcoming_installment: null, overdue_count: 0, total_installments: data?.length || 0, paid_count: (data || []).filter((p) => p.status === "paid").length };
  },
  installments: async () => [],
  paymentHistory: async () => {
    const user = await requireUser();
    const { data, error } = await supabase.from("payments").select("*").eq("user_id", user.id).order("paid_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(mapPayment);
  },
  payInstallment: async (_id: string) => ({ success: true }),

  documents: async () => {
    const user = await requireUser();
    const { data, error } = await supabase.from("documents").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  servicesCatalog: async () => SERVICE_CATALOG,
  requestService: async (body: any) => {
    const user = await requireUser();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        user_id: user.id,
        property_id: body.property_id || null,
        name: body.contact || "Service Request",
        phone: body.contact || "",
        message: body.description,
        source: `service:${body.service_type}`,
        status: "new",
        metadata: { preferred_date: body.preferred_date || null },
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { success: true, request: data };
  },
  myServices: async () => {
    const user = await requireUser();
    const { data, error } = await supabase.from("leads").select("*").eq("user_id", user.id).like("source", "service:%").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(mapService);
  },

  centres: async () => CENTRES,
  getCentre: async (id: string) => CENTRES.find((c) => c.id === id) || { ...CENTRES[0], id },
  bookCentreVisit: async (body: any) => {
    const user = await requireUser();
    const { data, error } = await supabase.from("site_visits").insert({ user_id: user.id, type: "centre", centre_id: body.centre_id, visit_date: body.visit_date, visit_time: body.visit_time, name: body.name, mobile: body.mobile, status: "confirmed" }).select("*").single();
    if (error) throw new Error(error.message);
    return { success: true, visit: data };
  },
  bookSiteVisit: async (body: any) => {
    const user = await requireUser();
    const { data, error } = await supabase.from("site_visits").insert({ user_id: user.id, type: "site", property_id: body.property_id, visit_date: body.visit_date, name: body.name, mobile: body.mobile, status: "confirmed" }).select("*").single();
    if (error) throw new Error(error.message);
    return { success: true, visit: data };
  },
  myVisits: async () => {
    const user = await requireUser();
    const { data, error } = await supabase.from("site_visits").select("*, properties(name)").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((v: any) => ({ ...v, property_name: v.properties?.name, centre_name: v.centre_id ? "Rivan Experience Centre" : undefined }));
  },

  toggleWishlist: async (property_id: string) => {
    const user = await requireUser();
    const existing = await supabase.from("wishlist").select("id").eq("user_id", user.id).eq("property_id", property_id).maybeSingle();
    if (existing.data) {
      const { error } = await supabase.from("wishlist").delete().eq("id", existing.data.id);
      if (error) throw new Error(error.message);
      return { wishlisted: false };
    }
    const { error } = await supabase.from("wishlist").insert({ user_id: user.id, property_id });
    if (error) throw new Error(error.message);
    return { wishlisted: true };
  },
  wishlist: async () => {
    const user = await requireUser();
    const { data, error } = await supabase.from("wishlist").select("properties(*, property_images(id, url, alt_text, sort_order))").eq("user_id", user.id);
    if (error) throw new Error(error.message);
    return (data || []).map((row: any) => mapProperty(row.properties)).filter(Boolean);
  },

  notifications: async () => {
    const user = await requireUser();
    const { data, error } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },
  readNotification: async (id: string) => {
    const user = await requireUser();
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
  readAllNotifications: async () => {
    const user = await requireUser();
    const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  adminStats: async () => null,
  adminUsers: async () => [],
  adminBookings: async () => [],
  adminConfirmBooking: async (_id: string) => ({ success: true }),
  adminServices: async () => [],
  adminUpdateService: async (_id: string, _status_val: string) => ({ success: true }),
};
