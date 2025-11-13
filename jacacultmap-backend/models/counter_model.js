import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
        unique: true
    },
    seq: {
        type: Number,
        required: true,
        default: 0
    }
});

const Counter = mongoose.model("counters", CounterSchema);

export default Counter;


