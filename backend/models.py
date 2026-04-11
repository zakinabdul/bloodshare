import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class Hospital(Base):
    __tablename__ = "hospitals"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str] = mapped_column(String, nullable=False)
    contact: Mapped[str] = mapped_column(String, nullable=False)

    inventory: Mapped[list["BloodInventory"]] = relationship(back_populates="hospital", cascade="all, delete-orphan")
    requests: Mapped[list["BloodRequest"]] = relationship(back_populates="hospital", cascade="all, delete-orphan")
    donation_logs: Mapped[list["DonationLog"]] = relationship(back_populates="hospital", cascade="all, delete-orphan")


class Donor(Base):
    __tablename__ = "donors"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    blood_type: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str] = mapped_column(String, nullable=False)
    contact: Mapped[str] = mapped_column(String, nullable=False)
    last_donation_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    donation_logs: Mapped[list["DonationLog"]] = relationship(back_populates="donor", cascade="all, delete-orphan")


class BloodInventory(Base):
    __tablename__ = "blood_inventory"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id: Mapped[str] = mapped_column(String, ForeignKey("hospitals.id"), nullable=False)
    blood_type: Mapped[str] = mapped_column(String, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_updated: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    hospital: Mapped["Hospital"] = relationship(back_populates="inventory")


class BloodRequest(Base):
    __tablename__ = "blood_requests"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id: Mapped[str] = mapped_column(String, ForeignKey("hospitals.id"), nullable=False)
    blood_type: Mapped[str] = mapped_column(String, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    urgency: Mapped[str] = mapped_column(String, nullable=False, default="MEDIUM")
    status: Mapped[str] = mapped_column(String, nullable=False, default="PENDING")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    hospital: Mapped["Hospital"] = relationship(back_populates="requests")


class DonationLog(Base):
    __tablename__ = "donation_logs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    donor_id: Mapped[str] = mapped_column(String, ForeignKey("donors.id"), nullable=False)
    hospital_id: Mapped[str] = mapped_column(String, ForeignKey("hospitals.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    status: Mapped[str] = mapped_column(String, nullable=False, default="SUCCESS")

    donor: Mapped["Donor"] = relationship(back_populates="donation_logs")
    hospital: Mapped["Hospital"] = relationship(back_populates="donation_logs")
