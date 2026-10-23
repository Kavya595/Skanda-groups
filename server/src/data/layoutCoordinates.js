import { initialPlots, parkData, layoutRoads, calculateExtraCharges } from './plotsData.js';
import { masterPlotsData, getEnrichedPlots } from '../../../client/src/visualizer/masterPlanData.js';

export const enrichedPlots = masterPlotsData;
export { parkData, layoutRoads, calculateExtraCharges, getEnrichedPlots, masterPlotsData };
