// Browser-compatible EventEmitter shim for Parse SDK
// This replaces the Node.js 'events' module with eventemitter3 for browser compatibility
import EventEmitter from 'eventemitter3'

// Export in the same format as Node.js events module
export { EventEmitter }
export default EventEmitter

// Also provide the module structure that some code expects
export const EventEmitter3 = EventEmitter
