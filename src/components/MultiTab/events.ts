import mitt, { Emitter, EventType } from "mitt";

export interface Mitter extends Emitter<Record<EventType, unknown>> {
  clearKey(name: string): void;
  once(name: string, data: any): void;
}

const events: Mitter = mitt() as Mitter;

events.clearKey = (name) => {
  events.all.delete(name);
};

events.once = (name, data) => {
  events.clearKey(name);
  events.on(name, data);
};

export default events;
