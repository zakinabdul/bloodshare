from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from models import Hospital, Donor, BloodInventory, BloodRequest, DonationLog
from schemas import (
    HospitalCreate, DonorCreate, InventoryCreate, InventoryUpdate,
    RequestCreate, RequestUpdate, DonationCreate,
)
from datetime import datetime


# ==================== HOSPITALS ====================

async def get_hospitals(db: AsyncSession):
    result = await db.execute(select(Hospital))
    return result.scalars().all()


async def create_hospital(db: AsyncSession, data: HospitalCreate):
    hospital = Hospital(**data.model_dump())
    db.add(hospital)
    await db.commit()
    await db.refresh(hospital)
    return hospital


# ==================== DONORS ====================

async def get_donors(db: AsyncSession):
    result = await db.execute(select(Donor))
    return result.scalars().all()


async def create_donor(db: AsyncSession, data: DonorCreate):
    donor = Donor(**data.model_dump())
    db.add(donor)
    await db.commit()
    await db.refresh(donor)
    return donor


# ==================== INVENTORY ====================

async def get_inventory(db: AsyncSession):
    result = await db.execute(
        select(BloodInventory, Hospital.name)
        .join(Hospital, BloodInventory.hospital_id == Hospital.id)
    )
    rows = result.all()
    items = []
    for inv, hospital_name in rows:
        d = {
            "id": inv.id,
            "hospital_id": inv.hospital_id,
            "blood_type": inv.blood_type,
            "quantity": inv.quantity,
            "last_updated": inv.last_updated,
            "hospital_name": hospital_name,
        }
        items.append(d)
    return items


async def create_inventory(db: AsyncSession, data: InventoryCreate):
    inv = BloodInventory(**data.model_dump())
    db.add(inv)
    await db.commit()
    await db.refresh(inv)
    return inv


async def update_inventory(db: AsyncSession, inv_id: str, data: InventoryUpdate):
    result = await db.execute(select(BloodInventory).where(BloodInventory.id == inv_id))
    inv = result.scalar_one_or_none()
    if not inv:
        return None
    inv.quantity = data.quantity
    inv.last_updated = datetime.utcnow()
    await db.commit()
    await db.refresh(inv)
    return inv


# ==================== BLOOD REQUESTS ====================

async def get_requests(db: AsyncSession):
    result = await db.execute(
        select(BloodRequest, Hospital.name)
        .join(Hospital, BloodRequest.hospital_id == Hospital.id)
        .order_by(BloodRequest.created_at.desc())
    )
    rows = result.all()
    items = []
    for req, hospital_name in rows:
        d = {
            "id": req.id,
            "hospital_id": req.hospital_id,
            "blood_type": req.blood_type,
            "quantity": req.quantity,
            "urgency": req.urgency,
            "status": req.status,
            "created_at": req.created_at,
            "hospital_name": hospital_name,
        }
        items.append(d)
    return items


async def create_request(db: AsyncSession, data: RequestCreate):
    req = BloodRequest(**data.model_dump())
    db.add(req)
    await db.commit()
    await db.refresh(req)
    return req


async def update_request(db: AsyncSession, req_id: str, data: RequestUpdate):
    result = await db.execute(select(BloodRequest).where(BloodRequest.id == req_id))
    req = result.scalar_one_or_none()
    if not req:
        return None
    req.status = data.status
    await db.commit()
    await db.refresh(req)
    return req


# ==================== DONATION LOGS ====================

async def get_donations(db: AsyncSession):
    result = await db.execute(
        select(DonationLog, Donor.name, Hospital.name)
        .join(Donor, DonationLog.donor_id == Donor.id)
        .join(Hospital, DonationLog.hospital_id == Hospital.id)
        .order_by(DonationLog.date.desc())
    )
    rows = result.all()
    items = []
    for log, donor_name, hospital_name in rows:
        d = {
            "id": log.id,
            "donor_id": log.donor_id,
            "hospital_id": log.hospital_id,
            "quantity": log.quantity,
            "date": log.date,
            "status": log.status,
            "donor_name": donor_name,
            "hospital_name": hospital_name,
        }
        items.append(d)
    return items


async def create_donation(db: AsyncSession, data: DonationCreate):
    log = DonationLog(**data.model_dump())
    db.add(log)
    # Update donor's last donation date
    donor_result = await db.execute(select(Donor).where(Donor.id == data.donor_id))
    donor = donor_result.scalar_one_or_none()
    if donor:
        donor.last_donation_date = datetime.utcnow()
    await db.commit()
    await db.refresh(log)
    return log


# ==================== STATS ====================

async def get_stats(db: AsyncSession):
    donors = await db.execute(select(func.count(Donor.id)))
    hospitals = await db.execute(select(func.count(Hospital.id)))
    units = await db.execute(select(func.coalesce(func.sum(BloodInventory.quantity), 0)))
    pending = await db.execute(
        select(func.count(BloodRequest.id)).where(BloodRequest.status == "PENDING")
    )
    donations = await db.execute(select(func.count(DonationLog.id)))

    return {
        "total_donors": donors.scalar() or 0,
        "total_hospitals": hospitals.scalar() or 0,
        "total_units": units.scalar() or 0,
        "pending_requests": pending.scalar() or 0,
        "total_donations": donations.scalar() or 0,
    }
