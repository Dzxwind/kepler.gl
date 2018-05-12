// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {min, max, mean, median, sum} from 'd3-array';
import {AGGREGATION_TYPES} from 'constants/default-settings';

const getOccurence = data => data.reduce((uniques, val) => {
  uniques[val] = true;
  return uniques;
}, {});

function getMostOrLeastOften(data, isMost) {
  const occr = getOccurence(data);

  return Object.keys(occr).reduce((prev, key) =>
    (isMost ? occr[prev] >= occr[key] : occr[prev] <= occr[key]) ?
      prev : key, Object.keys(occr)[0]);
}

export function aggregate(data, technique) {
  switch (technique) {
    case AGGREGATION_TYPES.average:
      return mean(data);
    case AGGREGATION_TYPES.countUnique:
      return Object.keys(
        data.reduce((uniques, val) => {
          uniques[val] = uniques[val] || 0;
          uniques[val] += 1;
          return uniques;
        }, {})
      ).length;
    case AGGREGATION_TYPES.mostOften:
      return getMostOrLeastOften(data, true);

    case AGGREGATION_TYPES.leastOften:
      return getMostOrLeastOften(data, false);

    case AGGREGATION_TYPES.maximum:
      return max(data);
    case AGGREGATION_TYPES.minimum:
      return min(data);
    case AGGREGATION_TYPES.median:
      return median(data);
    case AGGREGATION_TYPES.sum:
      return sum(data);
    default:
      return data.length;
  }
}
