import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import Hosting = require('../lib/hosting-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Hosting.HostingStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
