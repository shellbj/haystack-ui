
/*

  *  Copyright 2017 Expedia, Inc.
  *
  *     Licensed under the Apache License, Version 2.0 (the "License");
  *     you may not use this file except in compliance with the License.
  *     You may obtain a copy of the License at
  *
  *         http://www.apache.org/licenses/LICENSE-2.0
  *
  *     Unless required by applicable law or agreed to in writing, software
  *     distributed under the License is distributed on an "AS IS" BASIS,
  *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  *     See the License for the specific language governing permissions and
  *     limitations under the License.
  *

 */

const axios = require('axios');
const _ = require('lodash');
const Q = require('q');

const store = {};
const baseZipkinUrl = 'http://blackbox.prod-p.expedia.com/api/v1';

function getBinaryAnnotation(span, key) {
    return span.binaryAnnotations.find(annotation => annotation.key === key);
}


function mapQueryParams(query) {
    return Object
        .keys(query)
        .filter(key => query[key])
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');
}

store.getServices = () => {
    const deferred = Q.defer();

    axios({
        method: 'get',
        url: `${baseZipkinUrl}/services`
    }).then(response => deferred.resolve(response.data));

    return deferred.promise;
};

store.findTraces = (query) => {
    const deferred = Q.defer();
    const queryUrl = mapQueryParams(query);

    axios({
        method: 'get',
        url: `${baseZipkinUrl}/traces?limit=40&${queryUrl}`
    }).then((response) => {
        const traces = response.data;

        const mappedTraces = traces.map((trace) => {
            const rootSpan = trace.find(span => span.traceId === span.parentId);
            const services = _.countBy(trace,
                span => span.binaryAnnotations[0].endpoint.serviceName);
            const mappedServices = _.keys(services).map((service) => {
                const spans =
                    _.filter(trace,
                        span => span.binaryAnnotations[0].endpoint.serviceName === service);
                let serviceDuration = 0;
                spans.map((span) => {
                    serviceDuration = span.duration + serviceDuration;
                    return span;
                });

                return {
                    name: service,
                    spanCount: services[service],
                    duration: serviceDuration
                };
            });

            const urlAnnotation = getBinaryAnnotation(rootSpan, 'url');

            return {
                traceId: trace[0].traceId,
                services: mappedServices,
                root: {
                    url: urlAnnotation ? urlAnnotation.value : '/dummy/url',
                    serviceName: rootSpan.binaryAnnotations[0].endpoint.serviceName,
                    operationName: rootSpan.name
                },
                error: Math.random() < 0.2,
                startTime: Math.floor(rootSpan.timestamp / 1000000),
                duration: rootSpan.duration
            };
        });

        deferred.resolve(mappedTraces);
    });

    return deferred.promise;
};

module.exports = store;
