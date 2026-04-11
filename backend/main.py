from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db, init_db
from schemas import (
    HospitalCreate, HospitalOut,
    DonorCreate, DonorOut,
    InventoryCreate, InventoryUpdate, InventoryOut, InventoryWithHospital,
    RequestCreate, RequestUpdate, RequestOut, RequestWithHospital,
    DonationCreate, DonationOut, DonationWithNames,
    StatsOut,
)
import crud


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="LifeLink API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== HOSPITALS ====================

@app.get("/api/hospitals", response_model=list[HospitalOut])
async def list_hospitals(db: AsyncSession = Depends(get_db)):
    return await crud.get_hospitals(db)


@app.post("/api/hospitals", response_model=HospitalOut)
async def add_hospital(data: HospitalCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_hospital(db, data)


# ==================== DONORS ====================

@app.get("/api/donors", response_model=list[DonorOut])
async def list_donors(db: AsyncSession = Depends(get_db)):
    return await crud.get_donors(db)


@app.post("/api/donors", response_model=DonorOut)
async def add_donor(data: DonorCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_donor(db, data)


# ==================== INVENTORY ====================

@app.get("/api/inventory", response_model=list[InventoryWithHospital])
async def list_inventory(db: AsyncSession = Depends(get_db)):
    return await crud.get_inventory(db)


@app.post("/api/inventory", response_model=InventoryOut)
async def add_inventory(data: InventoryCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_inventory(db, data)


@app.put("/api/inventory/{inv_id}", response_model=InventoryOut)
async def update_inventory(inv_id: str, data: InventoryUpdate, db: AsyncSession = Depends(get_db)):
    result = await crud.update_inventory(db, inv_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Inventory entry not found")
    return result


# ==================== BLOOD REQUESTS ====================

@app.get("/api/requests", response_model=list[RequestWithHospital])
async def list_requests(db: AsyncSession = Depends(get_db)):
    return await crud.get_requests(db)


@app.post("/api/requests", response_model=RequestOut)
async def add_request(data: RequestCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_request(db, data)


@app.put("/api/requests/{req_id}", response_model=RequestOut)
async def update_request(req_id: str, data: RequestUpdate, db: AsyncSession = Depends(get_db)):
    result = await crud.update_request(db, req_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Request not found")
    return result


# ==================== DONATION LOGS ====================

@app.get("/api/donations", response_model=list[DonationWithNames])
async def list_donations(db: AsyncSession = Depends(get_db)):
    return await crud.get_donations(db)


@app.post("/api/donations", response_model=DonationOut)
async def add_donation(data: DonationCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_donation(db, data)


# ==================== STATS ====================

@app.get("/api/stats", response_model=StatsOut)
async def get_stats(db: AsyncSession = Depends(get_db)):
    return await crud.get_stats(db)
