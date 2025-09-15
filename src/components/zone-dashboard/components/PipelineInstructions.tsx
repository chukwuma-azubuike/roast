import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { getStageColor } from '../utils/stageUtils';
import { AssimilationStage } from '../../../store/types';

export function PipelineInstructions() {
    const stages = [
        { name: 'Invited', type: AssimilationStage.INVITED },
        { name: 'Attended', type: AssimilationStage.ATTENDED },
        { name: 'Discipled', type: AssimilationStage.DISCIPLED },
        { name: 'Joined', type: AssimilationStage.JOINED },
    ] as const;

    return (
        <Card>
            <CardContent className="p-4">
                <h3 className="font-medium mb-2">Pipeline Management</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Drag and drop guest cards between stages to update their assimilation progress.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                    {stages.map((stage, index) => (
                        <div key={stage.type} className="flex items-center space-x-1">
                            <div className={`w-3 h-3 rounded ${getStageColor(stage.type, 'bg')}`}></div>
                            <span>{stage.name}</span>
                            {index < stages.length - 1 && <ArrowRight className="w-3 h-3" />}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
