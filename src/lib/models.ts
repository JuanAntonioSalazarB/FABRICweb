import mongoose, { Schema } from 'mongoose';

// Lead (Waitlist signup) schema
const LeadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  scenario: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

// Assessment schema
const AssessmentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  answers: { type: [Number], required: true },
  score: { type: Number, required: true },
  riskLevel: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);

// Booking schema
const BookingSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  timeSlot: { type: String, required: true }, // Format: HH:MM
  createdAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

// AvailableSlot schema
const AvailableSlotSchema = new Schema({
  date: { type: String, required: true },      // YYYY-MM-DD
  timeSlot: { type: String, required: true },  // e.g. "09:00 AM CST" or "10:00"
  isBooked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const AvailableSlot = mongoose.models.AvailableSlot || mongoose.model('AvailableSlot', AvailableSlotSchema);


// Settings schema
const SettingsSchema = new Schema({
  systemPrompt: { type: String, default: '' },
  localKnowledge: { type: String, default: '' },
  openaiModel: { type: String, default: 'gpt-4o' },
  temperature: { type: Number, default: 0.1 },
  slackWebhook: { type: String, default: '' },
  referencesConsent: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now },
});

export const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

// SystemPrompt schema
const SystemPromptSchema = new Schema({
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const SystemPrompt = mongoose.models.SystemPrompt || mongoose.model('SystemPrompt', SystemPromptSchema);

// LocalKnowledge schema
const LocalKnowledgeSchema = new Schema({
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const LocalKnowledge = mongoose.models.LocalKnowledge || mongoose.model('LocalKnowledge', LocalKnowledgeSchema);

// Doctrine Lead schema
const DoctrineLeadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  answers: { type: Schema.Types.Mixed, required: true }, // Store answers object
  createdAt: { type: Date, default: Date.now },
});

export const DoctrineLead = mongoose.models.DoctrineLead || mongoose.model('DoctrineLead', DoctrineLeadSchema);

// Evidence Request Schema
const EvidenceRequestSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  docName: { type: String, required: true }, // name of document or paper
  type: { type: String, required: true }, // 'evidence' or 'paper'
  caseId: { type: String, default: 'general' }, // 'ape', 'aplazo', or 'general'
  ndaAccepted: { type: Boolean, required: true }, // true or false
  createdAt: { type: Date, default: Date.now },
});

export const EvidenceRequest = mongoose.models.EvidenceRequest || mongoose.model('EvidenceRequest', EvidenceRequestSchema);

// User schema for Clerk synced admin users
const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  role: { type: String, default: 'admin' }, // Range admin for all now
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

// SystemLog schema
const SystemLogSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  level: { type: String, default: 'info' }, // 'info', 'warn', 'error', 'success'
  category: { type: String, default: 'general' }, // 'auth', 'database', 'email', 'lead', 'system'
  message: { type: String, required: true },
  details: { type: Schema.Types.Mixed } // optional extra metadata
});

export const SystemLog = mongoose.models.SystemLog || mongoose.model('SystemLog', SystemLogSchema);



