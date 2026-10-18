import type {PhotoSequence} from './types';

// Add real, ordered photos in public/assets/360/<vehicle-id>/ and list them here.
// Set fullTurn only after verifying that the sequence covers the complete car.
// A single photograph is never labelled or treated as a 360-degree view.
export const vehiclePhotos:Record<string,PhotoSequence> = {
 etios:{frames:[],fullTurn:false}, ciaz:{frames:[],fullTurn:false},
 dzire:{frames:[],fullTurn:false}, innova:{frames:[],fullTurn:false},
 urbania:{frames:[],fullTurn:false}, tempo:{frames:[],fullTurn:false},
 ertiga:{frames:[],fullTurn:false}, crysta:{frames:[],fullTurn:false}
};
export function photoMode(sequence:PhotoSequence){
 return sequence.fullTurn&&sequence.frames.length>=12?'spin':sequence.frames.length>1?'gallery':'photo';
}
export function wrapFrame(index:number,length:number){return ((index%length)+length)%length}
