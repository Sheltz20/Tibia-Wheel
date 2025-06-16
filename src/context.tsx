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

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { binaryToContext, canReducePerk, cipToContext, contextToBinary, createEmptyPerks, iconCircle, isCipCode, levelForRevelation, perkAvailable, sum } from './utils';
import data from '../data.yaml';

export interface Context {
  level: number;
  vocation: Vocation;
  perks: Record<number, number>;
  revelation: number[];
  pointsMax: number;
  pointsLeft: number;
  selectedPerk: number | null;

  setLevel: (level: number) => void;
  setVocation: (vocation: Vocation) => void;
  setCharacter: (level: number, vocation: Vocation) => void;
  setPerk: (id: number, value: number) => void;
  selectPerk: (id: number | null) => void;
  reset: () => void;
}

export const RootContext = React.createContext<Context>({
  level: -1,
  vocation: 'knight',
  perks: {},
  revelation: [],
  pointsMax: 0,
  pointsLeft: 0,
  selectedPerk: null,

  setLevel() {},
  setVocation() {},
  setCharacter() {},
  setPerk() {},
  selectPerk() {},
  reset() {},
});

interface Props {
  children: React.ReactNode;
  onChange?: () => void;
}

function parseHash(): Partial<Context> {
  try {
    const code = location.hash.slice(1);
    if (isCipCode(code)) {
      const saved = cipToContext(code);
      location.hash = contextToBinary(saved);
      return saved;
    } else {
      return binaryToContext(code);
    }
  } catch (e) {}

  return {};
}

export const RootContextProvider: React.FC<Props> = ({ children, onChange }) => {
  const saved = parseHash();
  const isUpdating = useRef(false);
  const [ level, setLevel ] = useState<Context['level']>(saved.level ?? 0);
  const [ vocation, setVocation ] = useState<Context['vocation']>(saved.vocation ?? 'knight');
  const [ perks, setPerks ] = useState<Context['perks']>(saved.perks ?? createEmptyPerks());
  const [ selectedPerk, selectPerk ] = useState<Context['selectedPerk']>(null);

  const pointsMax = level - 50;
  const pointsLeft = Math.max(0, pointsMax - sum(Object.values(perks)));
  const revelation = new Array(4).fill(0).map((_, i) => levelForRevelation(perks, i));

  const onHashChange = useCallback(() => {
    if (isUpdating.current) {
      return;
    }

    const newState = parseHash();
    setLevel(newState.level ?? level);
    setVocation(newState.vocation ?? vocation);
    setPerks(newState.perks ?? perks);
  }, [ level, vocation, perks ]);

  useEffect(() => {
    isUpdating.current = true;
    location.hash = contextToBinary({ level, vocation, perks });
    isUpdating.current = false;
  }, [ level, vocation, perks ]);

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return <RootContext.Provider value={{
    level,
    vocation,
    perks,
    revelation,
    pointsMax,
    pointsLeft,
    selectedPerk,

    setLevel,
    setVocation(vocation) {
      setVocation(vocation);
      setPerks(createEmptyPerks());
      onChange?.();
    },

    setCharacter(level, vocation) {
      setLevel(level);
      setVocation(vocation);
      setPerks(createEmptyPerks());
      onChange?.();
    },

    setPerk(id: number, value: number) {
      setPerks((currentPerks) => {
        const current = currentPerks[id];
        const circle = iconCircle(id);
        const maxPoints = data.pointsPerCircle[circle];

        if (value < current && !canReducePerk(perks, id) || !perkAvailable(currentPerks, id)) {
          return currentPerks;
        }

        const clampedValue = current + Math.min(value - current, pointsLeft);

        return {
          ...currentPerks,
          [id]: Math.max(0, Math.min(maxPoints, clampedValue)),
        }
      });

      onChange?.();
    },

    selectPerk,

    reset() {
      setPerks(createEmptyPerks());
      onChange?.();
    }
  }}>
    { children }
  </RootContext.Provider>
};
