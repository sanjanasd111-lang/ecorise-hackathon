import mongoose from 'mongoose';
import { createCollection } from './dbAdapter.js';

const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  questions: [
    {
      id: { type: String, required: true },
      question: { type: String, required: true },
      options: [{ type: String }]
    }
  ]
}, { timestamps: true });

let MongooseSurvey = null;
try {
  MongooseSurvey = mongoose.models.Survey || mongoose.model('Survey', surveySchema);
} catch (e) {}

export const Survey = createCollection('surveys', MongooseSurvey);

const surveyResponseSchema = new mongoose.Schema({
  surveyId: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  answers: { type: Object, default: {} },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

let MongooseSurveyResponse = null;
try {
  MongooseSurveyResponse = mongoose.models.SurveyResponse || mongoose.model('SurveyResponse', surveyResponseSchema);
} catch (e) {}

export const SurveyResponse = createCollection('surveyResponses', MongooseSurveyResponse);
