import os
import sys
import asyncio
from pathlib import Path

from fastapi.testclient import TestClient


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("JWT_SECRET", "test-only-jwt-secret")
os.environ.setdefault("ALLOW_LOCAL_AUTH_FALLBACK", "false")

from server import app, health_check  # noqa: E402


client = TestClient(app)


def test_legacy_auth_endpoints_are_disabled():
    payloads = {
        "/api/auth/register": {"name": "Test User", "email": "test@example.com", "password": "Secret123"},
        "/api/auth/login": {"email": "test@example.com", "password": "Secret123"},
        "/api/auth/send-otp": {"phone": "9491348973"},
        "/api/auth/verify-otp": {"phone": "9491348973", "otp": "123456"},
        "/api/auth/google": {"id_token": "x" * 24},
    }
    for path, payload in payloads.items():
        response = client.post(path, json=payload)
        assert response.status_code == 410, (path, response.text)


def test_payment_endpoints_are_not_in_active_scope():
    for path in (
        "/api/payments/summary",
        "/api/payments/installments",
        "/api/payments/history",
    ):
        response = client.get(path)
        assert response.status_code == 401


def test_admin_route_family_is_registered():
    route_paths = {route.path for route in app.routes}
    assert "/api/admin/stats" in route_paths
    assert "/api/admin/users" in route_paths
    assert "/api/admin/agents" in route_paths


def test_websocket_route_is_registered():
    route_paths = {route.path for route in app.routes}
    assert "/ws/live" in route_paths


def test_health_check_reports_degraded_state_when_database_is_unavailable():
    result = asyncio.run(health_check())
    assert "live_updates_enabled" in result
    if result["ok"] is False:
        assert result["database"] == "unavailable"
        assert result["live_updates_enabled"] is False
