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

import React from 'react';
import { CharacterSearch } from './components/CharacterSearch';
import { RootContextProvider } from './context';
import { Wheel } from './components/Wheel';

import { VocationSelector } from './components/VocationSelector';
import { Summary } from './components/Summary';
import { Widget } from './components/Widget';
import { ClientCode } from './components/ClientCode';

export const App: React.FC = () => {
  return <>
    <RootContextProvider>
      <Wheel/>
        <Widget>
          <CharacterSearch />
          <VocationSelector />
          <ClientCode />
        </Widget>
        <Summary />
    </RootContextProvider>
  </>;
};
