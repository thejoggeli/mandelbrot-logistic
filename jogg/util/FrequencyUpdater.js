import FrequencyCounter from "./FrequencyCounter.js"
import Timer from "./Timer.js"
import Log from "../log/Log.js"

export default class FrequencyUpdater {
    constructor(caller, func){

        this.caller = caller
        this.func = func

        // count how many updates have actually passed
        this.frequency_counter_timer = new Timer()
        this.frequency_counter = new FrequencyCounter()

        // calculated when setFrequency() gets called
        this.frequency_target = 0
        this.frequency_actual = 0
        this.timestep = 0
        this.timestep_ms = 0

        // default frequency
        this.setFrequency(60)

        // how many updates happened in total
        this.updates_total = 0

        // maximum number of updates per frame
        this.max_updates_per_frame = 10

        // needed to calculate how many updates should have happened
        this.time_reference = 0

        // needed to know how many updates have actually happened
        this.update_reference = 0

    }
    setFrequency(frequency_target){
        this.frequency_target = frequency_target
        this.frequency_actual = 0
        this.timestep = 1.0 / this.frequency_target
        this.timestep_ms = this.timestep * 1000.0        
    }
    start(time){
        this.time_reference = time
        this.frequency_counter.start(time)
        this.frequency_counter_timer.start(time, 1.0)
    }
    frame(time){

        var update_target = Math.floor((time - this.time_reference)*this.frequency_target)+1
        var frame_updates_counter = 0

        while(this.update_reference < update_target){
            
            // call update function
            this.func.call(this.caller)

            // increment how many updates have happened in total
            this.updates_total += 1

            // increment update reference
            this.update_reference += 1

            // increment how many updates have happened this frame
            frame_updates_counter += 1

            // count up frequency counter to measure actual update rate
            this.frequency_counter.count()

            // break if max updates per frame passed
            if(frame_updates_counter == this.max_updates_per_frame){
                Log.warning("FrequencyUpdater", "max updates reached, t=" + time)
                // reset the time reference and updater reference
                this.update_reference = 0
                this.time_reference = time
                break
            }
        }

        // compute actual frequency
        if(this.frequency_counter_timer.isFinished(time)){
            this.frequency_actual = this.frequency_counter.compute(time)
            this.frequency_counter_timer.restart(time, false)
        }

    }

}