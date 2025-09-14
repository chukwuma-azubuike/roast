import mongoose from 'mongoose';

const milestoneDefinitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  required: { type: Boolean, default: false },
  order: { type: Number, required: true }
});

const pipelineStageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  color: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  milestones: [milestoneDefinitionSchema],
  autoAdvance: { type: Boolean, default: false },
  autoAdvanceConditions: { type: Map, of: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const notificationRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  triggerEvent: { 
    type: String,
    enum: ['stagnant_guest', 'milestone_completed', 'stage_transition', 'guest_added', 'guest_assigned'],
    required: true
  },
  conditions: { type: Map, of: mongoose.Schema.Types.Mixed },
  recipients: [{
    type: String,
    enum: ['worker', 'coordinator', 'admin']
  }],
  isActive: { type: Boolean, default: true },
  template: {
    title: String,
    message: String,
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM'
    }
  }
}, { timestamps: true });

const Pipeline = mongoose.model('Pipeline', pipelineStageSchema);
const NotificationRule = mongoose.model('NotificationRule', notificationRuleSchema);

export { Pipeline, NotificationRule };
