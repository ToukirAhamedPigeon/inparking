// lib/logger.ts
import Log from '@/models/Log'
import { EActionType, ILog } from '@/types'
import dbConnect from './dbConnect'
import { Types } from 'mongoose'
import { getAuthUserIdFromCookie } from '@/lib/getAuthUser'

interface LogInput {
  detail?: string;
  changes?: string;
  actionType: EActionType;
  collectionName: string;
  objectId?: string;
}

export async function logAction({
  detail,
  changes,
  actionType,
  collectionName,
  objectId,
}: LogInput): Promise<ILog | null> {
  try {
    await dbConnect();

    const authUserId = await getAuthUserIdFromCookie()

    const log = await Log.create({
      detail,
      changes,
      actionType,
      collectionName,
      objectId,
      createdBy: authUserId,
    });

    return log;
  } catch (error) {
    console.error('❌ Failed to log action:', error);
    return null;
  }
}
