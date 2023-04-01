/**
 * Enviroment: names storage.
 */
class Environment {
    /**
     * Creates an environment with given record.
     */
    constructor(record = {}, parent = null) {
        this.record = record;
        this.parent = parent;
    }
    /**
     * Creates a variable with the given name and value.
     */
    define(name, value){
        this.record[name] = value;
        return value;
    }
    /**
     * Updated an existing variable
     */
    assign(name, value){
        this.resolve(name).record[name] = value;
        return value;
    }
    /**
     * Ensuring all variables are save to the env record.
     */
    printEnvRecord(){
        console.log(this.record);
        console.log(this.parent);
    }
    /**
     * Returns the value of a defined variable or throws
     * if the value is not defined.
     */
    lookup(name){
        return this.resolve(name).record[name];
        }
        /**
         * Returns specific environment in which a variable is defined, or 
         * throws if a variable is not defined.
         */
        resolve(name) {
            if(this.record.hasOwnProperty(name)) {
                return this;
            }
            if (this.parent == null){
            throw new ReferenceError(`Variable "${name}" is not defined`);
            }
            return this.parent.resolve(name);
        }
    }

module.exports = Environment;
