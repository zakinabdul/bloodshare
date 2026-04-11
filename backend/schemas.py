from pydantic import BaseModel
from datetime import datetime


# ---------- Hospital ----------
class HospitalCreate(BaseModel):
    name: str
    location: str
    contact: str


class HospitalOut(BaseModel):
    id: str
    name: str
    location: str
    contact: str

    model_config = {"from_attributes": True}


# ---------- Donor ----------
class DonorCreate(BaseModel):
    name: str
    blood_type: str
    location: str
    contact: str


class DonorOut(BaseModel):
    id: str
    name: str
    blood_type: str
    location: str
    contact: str
    last_donation_date: datetime | None = None

    model_config = {"from_attributes": True}


# ---------- Blood Inventory ----------
class InventoryCreate(BaseModel):
    hospital_id: str
    blood_type: str
    quantity: int


class InventoryUpdate(BaseModel):
    quantity: int


class InventoryOut(BaseModel):
    id: str
    hospital_id: str
    blood_type: str
    quantity: int
    last_updated: datetime

    model_config = {"from_attributes": True}


class InventoryWithHospital(InventoryOut):
    hospital_name: str = ""


# ---------- Blood Request ----------
class RequestCreate(BaseModel):
    hospital_id: str
    blood_type: str
    quantity: int
    urgency: str = "MEDIUM"


class RequestUpdate(BaseModel):
    status: str


class RequestOut(BaseModel):
    id: str
    hospital_id: str
    blood_type: str
    quantity: int
    urgency: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class RequestWithHospital(RequestOut):
    hospital_name: str = ""


# ---------- Donation Log ----------
class DonationCreate(BaseModel):
    donor_id: str
    hospital_id: str
    quantity: int = 1


class DonationOut(BaseModel):
    id: str
    donor_id: str
    hospital_id: str
    quantity: int
    date: datetime
    status: str

    model_config = {"from_attributes": True}


class DonationWithNames(DonationOut):
    donor_name: str = ""
    hospital_name: str = ""


# ---------- Stats ----------
class StatsOut(BaseModel):
    total_donors: int
    total_hospitals: int
    total_units: int
    pending_requests: int
    total_donations: int
