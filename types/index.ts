// types/index.ts

import { Types } from 'mongoose';
export enum EUserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum EActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum EModelType {
  User = 'User',
  ROUTE = 'Route',
  SLOT = 'Slot',
  ZONE = 'Zone'
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  decryptedPassword: string;
  profilePicture: IImage;
  role: EUserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IImage {
  _id: Types.ObjectId;
  imageUrl: string;
  imageTitle?: string;
  imageDetail?: string;
  modelType: string;
  modelId: Types.ObjectId;
  createdBy: IUser;
  createdAt: Date;
}

export interface IRoute {
  _id: Types.ObjectId;
  fromAddress?: string;
  toAddress?: string;
  toZoneId: IZone;
  description?: string;
  images: IImage[];
  isActive: boolean;
  createdBy: IUser;
  updatedBy: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISlot {
  _id: Types.ObjectId;
  zoneId: IZone;
  slotNumber: string;
  slotDetail?: string;
  images: IImage[];
  qrString: string;
  isActive: boolean;
  createdBy: IUser;
  updatedBy: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IZone {
  _id: Types.ObjectId;
  name: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  routes: IRoute[];
  images: IImage[];
  slots: ISlot[];
  contactName?: string;
  contactNo?: string;
  isActive: boolean;
  createdBy: IUser;
  updatedBy: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAllotment {
  _id: Types.ObjectId;
  slotId: ISlot;
  zoneId: IZone;
  guestName?: string;
  guestContactNo?: string;
  guestDetail?: string;
  driverName?: string;
  driverContactNo?: string;
  isOwnerDriver: boolean;
  allotmentFrom: Date;
  allotmentTo: Date;
  qrString: string;
  createdBy: IUser;
  updatedBy: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILog {
  _id: Types.ObjectId;
  detail?: string;
  changes?: string;
  actionType: EActionType;
  collectionName: string;
  objectId?: string;
  createdBy: IUser;
  createdAt: Date;
}

export type adminLayoutUserProps={
    name: string
    email: string
    profilePicture?: string
    role: EUserRole
}
