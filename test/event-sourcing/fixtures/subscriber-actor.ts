/**
 * Copyright (c) 2018-present, tarant
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { EventSourcedActor } from '../../../lib/event-sourcing/event-sourced-actor'

export default class SubscriberActor extends EventSourcedActor {
  public constructor(doSubscribeLambda: (a: SubscriberActor) => void) {
    super()
    doSubscribeLambda(this)
  }

  public somethingHappened(): void {
    return
  }
}
