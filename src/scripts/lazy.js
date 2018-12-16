export function defineLazyProperties(target, lazyProperties) {
    let properties = {}
    for (let [key, valueFunction] of Object.entries(lazyProperties)) {
        let value = null
        let isValueSet = false
        properties[key] = {
            get() {
                if (!isValueSet) { value = valueFunction(); isValueSet = true }
                return value
            }
        }
    }
    Object.defineProperties(target, properties)
    return target
}
