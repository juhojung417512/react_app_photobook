let _store = null
export default function(store){
    _store = store || _store
    return _store
} 