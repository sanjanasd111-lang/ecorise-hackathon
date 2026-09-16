import crypto from 'crypto';
import { getStore, saveStore, isUsingMongoose } from '../config/db.js';

function matchFilter(doc, filter) {
  if (!filter || Object.keys(filter).length === 0) return true;
  for (const [key, val] of Object.entries(filter)) {
    const docVal = doc[key];
    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
      if (val.$in && Array.isArray(val.$in)) {
        if (!val.$in.includes(docVal)) return false;
      } else if (val.$gte !== undefined && Number(docVal) < Number(val.$gte)) {
        return false;
      } else if (val.$lte !== undefined && Number(docVal) > Number(val.$lte)) {
        return false;
      } else if (val.$ne !== undefined && docVal === val.$ne) {
        return false;
      }
    } else if (key === '_id' || key === 'id') {
      const docId = String(doc._id || doc.id);
      const targetId = String(val);
      if (docId !== targetId) return false;
    } else {
      if (String(docVal).toLowerCase() !== String(val).toLowerCase()) {
        return false;
      }
    }
  }
  return true;
}

function wrapDoc(collectionName, item) {
  if (!item) return null;
  const store = getStore();
  
  return {
    ...item,
    _id: item._id || item.id,
    id: item.id || item._id,
    async save() {
      const col = store[collectionName];
      const idx = col.findIndex(x => (x._id || x.id) === (item._id || item.id));
      if (idx >= 0) {
        col[idx] = { ...this, updatedAt: new Date().toISOString() };
      } else {
        col.push(this);
      }
      saveStore();
      return this;
    },
    toObject() {
      const copy = { ...this };
      delete copy.save;
      delete copy.toObject;
      return copy;
    }
  };
}

export function createCollection(collectionName, mongooseModel) {
  return {
    async find(filter = {}) {
      if (isUsingMongoose() && mongooseModel) {
        return await mongooseModel.find(filter).lean();
      }
      const store = getStore();
      const col = store[collectionName] || [];
      return col.filter(doc => matchFilter(doc, filter)).map(doc => wrapDoc(collectionName, doc));
    },

    async findOne(filter = {}) {
      if (isUsingMongoose() && mongooseModel) {
        return await mongooseModel.findOne(filter);
      }
      const store = getStore();
      const col = store[collectionName] || [];
      const item = col.find(doc => matchFilter(doc, filter));
      return item ? wrapDoc(collectionName, item) : null;
    },

    async findById(id) {
      if (isUsingMongoose() && mongooseModel) {
        return await mongooseModel.findById(id);
      }
      const store = getStore();
      const col = store[collectionName] || [];
      const item = col.find(doc => String(doc._id || doc.id) === String(id));
      return item ? wrapDoc(collectionName, item) : null;
    },

    async create(data) {
      if (isUsingMongoose() && mongooseModel) {
        return await mongooseModel.create(data);
      }
      const store = getStore();
      if (!store[collectionName]) store[collectionName] = [];
      const newId = data._id || data.id || crypto.randomUUID();
      const now = new Date().toISOString();
      const newDoc = {
        _id: newId,
        id: newId,
        ...data,
        createdAt: data.createdAt || now,
        updatedAt: data.updatedAt || now
      };
      store[collectionName].push(newDoc);
      saveStore();
      return wrapDoc(collectionName, newDoc);
    },

    async updateOne(filter, update) {
      if (isUsingMongoose() && mongooseModel) {
        return await mongooseModel.updateOne(filter, update);
      }
      const item = await this.findOne(filter);
      if (!item) return { matchedCount: 0, modifiedCount: 0 };
      const setVals = update.$set ? update.$set : update;
      Object.assign(item, setVals);
      await item.save();
      return { matchedCount: 1, modifiedCount: 1 };
    },

    async findOneAndUpdate(filter, update, options = {}) {
      if (isUsingMongoose() && mongooseModel) {
        return await mongooseModel.findOneAndUpdate(filter, update, options);
      }
      let item = await this.findOne(filter);
      if (!item && options.upsert) {
        const createData = { ...filter, ...(update.$set || update) };
        return await this.create(createData);
      }
      if (!item) return null;
      const setVals = update.$set ? update.$set : update;
      const incVals = update.$inc;
      if (incVals) {
        for (const [k, v] of Object.entries(incVals)) {
          item[k] = (Number(item[k]) || 0) + Number(v);
        }
      }
      Object.assign(item, setVals);
      await item.save();
      return item;
    },

    async countDocuments(filter = {}) {
      if (isUsingMongoose() && mongooseModel) {
        return await mongooseModel.countDocuments(filter);
      }
      const results = await this.find(filter);
      return results.length;
    }
  };
}
