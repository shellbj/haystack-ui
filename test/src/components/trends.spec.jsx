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
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Trends from '../../../src/components/trends/trends';

describe('<Trends />', () => {
    it('should render the trends panel`', () => {
        const wrapper = shallow(<Trends />);
        expect(wrapper.find('.trends-panel')).to.have.length(1);
    });
});
