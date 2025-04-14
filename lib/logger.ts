// lib/logger.ts
import Log from '@/models/Log'
import { EActionType, ILog } from '@/types'
import dbConnect from './dbConnect'
import { Types } from 'mongoose'

interface LogInput {
  detail?: string;
  changes?: string;
  actionType: EActionType;
  collectionName: string;
  objectId?: string;
  createdBy: Types.ObjectId | string; // support both formats
}

export async function logAction({
  detail,
  changes,
  actionType,
  collectionName,
  objectId,
  createdBy,
}: LogInput): Promise<ILog | null> {
  try {
    await dbConnect();

    const log = await Log.create({
      detail,
      changes,
      actionType,
      collectionName,
      objectId,
      createdBy: new Types.ObjectId(createdBy),
    });

    return log;
  } catch (error) {
    console.error('❌ Failed to log action:', error);
    return null;
  }
}
