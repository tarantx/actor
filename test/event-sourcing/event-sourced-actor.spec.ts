/**
 * Copyright (c) 2018-present, tarant
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ActorSystem from '../../lib/actor-system/actor-system'
import sleep from '../fixtures/sleep'
import PublisherActor from './fixtures/publisher-actor'

describe('Actor System Subscriptions', () => {
  let actorSystem: ActorSystem

  beforeEach(() => {
    actorSystem = ActorSystem.default()
  })

  afterEach(() => {
    actorSystem.free()
  })

  test('that applied messages are in the journal', async () => {
    const publisher = actorSystem.actorOf(PublisherActor, [])
    publisher.somethingHappens()

    await sleep(1)
    expect(publisher.ref.journal()).toEqual([
      {
        data: [],
        family: 'PublisherActor',
        name: 'somethingHappened',
        stream: publisher.ref.id,
        version: 1,
      },
    ])
  })
})
