import mongoose from 'mongoose';


const taskSchema = mongoose.Schema({
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            maxLength: [150, 'Max length is 150 characters']
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['todo', 'in_progress', 'in_review', 'done'],
            default: 'todo',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
        dueDate: {
            type: Date,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
)

taskSchema.index({ assignedTo: 1, status: 1 });
export const Task = mongoose.model('Task', taskSchema);