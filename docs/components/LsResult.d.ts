import React from 'react';
import { LsResultType } from '../commands/ls';
interface LsResultProps {
    lsResult: LsResultType;
}
declare const LsResult: React.FC<LsResultProps>;
export default LsResult;
