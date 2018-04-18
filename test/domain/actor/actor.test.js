import Actor from "../../../lib/domain/actor/actor";

let createActor = (cb) => {
    return new (class extends Actor {
        constructor() {
            super();

            this.onReceive = cb || jest.fn();
        }
    })();
};

describe("Actor", () => {
    test("should put the received message at the end of the mailbox", () => {
        let actor = createActor();
        actor.receiveMessage(1);

        let [ message ] = actor.mailbox;
        expect(message).toBe(1);
    });

    test("should pull a message and call onReceive with that message", () => {
        let actor = createActor();
        actor.receiveMessage(1);

        actor.pull();

        expect(actor.mailbox).toEqual([]);
        expect(actor.onReceive.mock.calls[0][0]).toBe(1);
    });

    test("should tell a message to another actors mailbox", () => {
        let sender = createActor();
        let receiver = createActor();

        sender.tell(receiver, "message");

        let [ { origin, message } ] = receiver.mailbox;

        expect(origin).toEqual(sender);
        expect(message).toBe("message");
    });

    test("ask should use the return value of an actor onReceive call", () => {
        let sender = createActor();
        let receiver = createActor(() => 1);

        let promise = sender.ask(receiver, "whatever");
        receiver.pull();

        expect(promise).resolves.toBe(1);
    });

    test("ask should return a failed promise in case of an error in the target actor", () => {
        let sender = createActor();
        let receiver = createActor(() => { throw "error" });

        let promise = sender.ask(receiver, "whatever");
        receiver.pull();

        expect(promise).rejects.toThrow("error");
    });
});