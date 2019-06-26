import {hashId, patternDB} from '../tables/pdb-hash6.json';
import hashes from './hashes.js';

let hash = hashes[hashId];

export default cubeState => patternDB[hash(cubeState)];
