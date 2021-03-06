/*
 * Copyright 2017 Expedia, Inc.
 *
 *       Licensed under the Apache License, Version 2.0 (the "License");
 *       you may not use this file except in compliance with the License.
 *       You may obtain a copy of the License at
 *
 *           http://www.apache.org/licenses/LICENSE-2.0
 *
 *       Unless required by applicable law or agreed to in writing, software
 *       distributed under the License is distributed on an "AS IS" BASIS,
 *       WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *       See the License for the specific language governing permissions and
 *       limitations under the License.
 *
 */

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Alerts from '../../../src/components/alerts/alerts';

describe('<Help />', () => {
    it('should render the alerts panel`', () => {
        const wrapper = mount(<Alerts />);
        expect(wrapper.find('.alerts-panel')).to.have.length(1);
    });
});
