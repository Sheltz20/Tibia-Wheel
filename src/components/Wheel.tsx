/* 
 * This file is part of Tibia Wheel.
 * Copyright (c) 2022 Maciej Sopyło
 * 
 * Tibia Wheel is free software: you can redistribute it and/or modify  
 * it under the terms of the GNU Lesser General Public License as published by  
 * the Free Software Foundation, version 3.
 *
 * Tibia Wheel is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License 
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useContext } from 'react';
import { RootContext } from '../context';

import largeIcons from '../../assets/skillwheel/icons-skillwheel-largeperks.png?as=webp';
import mediumIcons from '../../assets/skillwheel/icons-skillwheel-mediumperks.png?as=webp';
import smallIcons from '../../assets/skillwheel/icons-skillwheel-smallperks.png?as=webp';

import styles from './Wheel.module.css';
import data from '../../data.yaml';
import { cssVars, iconCircle, perkIsTiered } from '../utils';
import { WheelSlice } from './WheelSlice';
import { Widget } from './Widget';
import { PerkSummary } from './PerkSummary';
import { WheelRevelation } from './WheelRevelation';

const ROTATIONS: Record<Vocation, number> = {
  knight: 90,
  paladin: -90,
  sorcerer: 180,
  druid: 0,
};
const CORNERS = new Array(4).fill(0).map((_, i) => i);
const SLICES = new Array(36).fill(0).map((_, i) => 35 - i);

export const Wheel: React.FC = () => {
  const {
    vocation,
    perks,
    selectedPerk,
    setPerk,
    pointsLeft,
    pointsMax,
    reset,
  } = useContext(RootContext);

  function addToSelected(value: number) {
    return () => {
      if (selectedPerk === null) {
        return;
      }

      setPerk(selectedPerk, perks[selectedPerk] + value);
    }
  }


  const selectedMax = selectedPerk !== null ? data.pointsPerCircle[iconCircle(selectedPerk)] : 0;
  const selectedDedication = selectedPerk !== null ? data.perks.dedication[selectedPerk] : -1;
  const selectedConviction = selectedPerk !== null ? data.perks.conviction[vocation][selectedPerk] : -1;

  return <section
    className={styles.wheel}
    style={cssVars({ rotation: `${ROTATIONS[vocation]}deg` })}>
      <svg width="522" height="522" xmlns="http://www.w3.org/2000/svg" fill="transparent">
        <defs>
          { new Array(data.conviction.length).fill(0).map((_, i) => <pattern
            key={`medium-${i}`}
            id={`medium-${i}`}
            patternUnits="userSpaceOnUse"
            width="30"
            height="30">
              <image
                href={mediumIcons}
                x={i * -30}
                y="0"
                width={30 * data.conviction.length}
                height="30"/>
          </pattern>) }
          { new Array(data.dedication.length).fill(0).map((_, i) => <pattern
            key={`small-${i}`}
            id={`small-${i}`}
            patternUnits="userSpaceOnUse"
            width="16"
            height="16">
              <image
                href={smallIcons}
                x={i * -16}
                y="0"
                width={16 * data.dedication.length}
                height="16"/>
          </pattern>) }
          { new Array(data.revelation.length).fill(0).map((_, i) => <pattern
            key={`large-${i}`}
            id={`large-${i}`}
            patternUnits="userSpaceOnUse"
            width="34"
            height="34">
              <image
                href={largeIcons}
                x={i * -34}
                y="0"
                width={34 * data.revelation.length}
                height="34"/>
          </pattern>) }
        </defs>
        <g transform="translate(261, 261)">
          { CORNERS.map((i) => <WheelRevelation key={`corner-${i}`} index={i}/>)}
          { SLICES.map((i) => <WheelSlice key={`slice-${i}`} index={i}/>) }
        </g>
      </svg>
      <Widget>
        <p>
          Used points: { pointsMax - pointsLeft }/{ Math.max(0, pointsMax) }
          <button
            style={{ float: 'right' }}
            onClick={reset}>
              reset
          </button>
        </p>
        <details>
          <summary>Usage</summary>
          <p>
            The interface works like in the game - click to select a perk and use buttons
            to add or remove points. Right click on a slice to fill it completely; if it's already
            full or you have no points left it will be cleared instead.
          </p>
          <p>
            You can share your builds using the URL - it automatically updates on any change.
          </p>
        </details>
      </Widget>
      { selectedPerk !== null && <Widget>
        <PerkSummary as="article" type="conviction" index={selectedConviction} value={perkIsTiered(data.conviction[selectedConviction]) ? 0 : 1}/>
        <PerkSummary as="article" type="dedication" index={selectedDedication} value={1}/>
        <fieldset>
          <button onClick={addToSelected(1)}>+1</button>
          <button onClick={addToSelected(10)}>+10</button>
          <button onClick={addToSelected(250)}>+max</button>
          <span>{perks[selectedPerk]}/{selectedMax}</span>
          <button onClick={addToSelected(-250)}>-max</button>
          <button onClick={addToSelected(-10)}>-10</button>
          <button onClick={addToSelected(-1)}>-1</button>
        </fieldset>
      </Widget> }
  </section>;
}
