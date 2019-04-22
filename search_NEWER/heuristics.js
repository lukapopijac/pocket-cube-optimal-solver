import {hashId, patternDB} from './tables/pdb-hash7.json';
import hashes from './hashes.js';

let hash = hashes[hashId];

export default cubeState => patternDB[hash(cubeState)];
