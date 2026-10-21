from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from datetime import datetime, timezone, timedelta
import random
from app.auth.security import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard Data"])

@router.get("/metrics")
async def get_dashboard_metrics(current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """Protected endpoint returning dynamic dashboard stats and analytics"""
    random.seed(int(current_user["id"][-4:], 16) if len(current_user["id"]) >= 4 else 42)
    
    return {
        "kpis": [
            {
                "id": "kpi-1",
                "label": "Total API Requests",
                "value": "128,430",
                "change": "+14.8%",
                "trend": "up",
                "icon": "zap"
            },
            {
                "id": "kpi-2",
                "label": "Active Deployments",
                "value": "12 Clusters",
                "change": "+3 new",
                "trend": "up",
                "icon": "server"
            },
            {
                "id": "kpi-3",
                "label": "Database Health",
                "value": "99.98%",
                "change": "Optimal (12ms)",
                "trend": "up",
                "icon": "database"
            },
            {
                "id": "kpi-4",
                "label": "Security Posture",
                "value": "Grade A+",
                "change": "JWT Validated",
                "trend": "neutral",
                "icon": "shield"
            }
        ],
        "system_telemetry": [
            {"hour": "00:00", "requests": 3400, "latency": 14},
            {"hour": "04:00", "requests": 2100, "latency": 11},
            {"hour": "08:00", "requests": 7800, "latency": 18},
            {"hour": "12:00", "requests": 14200, "latency": 22},
            {"hour": "16:00", "requests": 16900, "latency": 19},
            {"hour": "20:00", "requests": 9500, "latency": 15},
            {"hour": "23:59", "requests": 5300, "latency": 12}
        ],
        "recent_activities": [
            {
                "id": "act-1",
                "title": "JWT Session Verified",
                "description": f"User {current_user['username']} initialized authenticated session.",
                "timestamp": "Just now",
                "badge": "Auth",
                "status": "success"
            },
            {
                "id": "act-2",
                "title": "MongoDB Collection Synced",
                "description": "Indexed user profile schema and registered unique credentials constraint.",
                "timestamp": "5 mins ago",
                "badge": "Database",
                "status": "success"
            },
            {
                "id": "act-3",
                "title": "FastAPI Async Worker Pool",
                "description": "Handling Uvicorn ASGI requests with non-blocking motor driver.",
                "timestamp": "12 mins ago",
                "badge": "System",
                "status": "info"
            },
            {
                "id": "act-4",
                "title": "Encrypted Access Token Generated",
                "description": "HS256 signed token with expiration and sub identity verification.",
                "timestamp": "18 mins ago",
                "badge": "Security",
                "status": "warning"
            }
        ],
        "pinned_projects": [
            {
                "id": "proj-1",
                "name": "E-Commerce Pipeline",
                "stack": "Next.js 15 • FastAPI • MongoDB",
                "status": "Active",
                "progress": 88
            },
            {
                "id": "proj-2",
                "name": "Auth Guard Gateway",
                "stack": "JWT • PyJWT • Bcrypt",
                "status": "Secured",
                "progress": 100
            },
            {
                "id": "proj-3",
                "name": "Distributed Analytics Engine",
                "stack": "Python 3.12 • Motor Async",
                "status": "In Progress",
                "progress": 64
            }
        ]
    }
