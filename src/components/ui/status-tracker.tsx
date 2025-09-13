
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, CircleDashed, Milestone, Wrench, BadgeCheck } from 'lucide-react';

export type ProblemStatus = 'Submitted' | 'Under Review' | 'Assigned' | 'Resolved';

const statuses: ProblemStatus[] = ['Submitted', 'Under Review', 'Assigned', 'Resolved'];

const statusIcons = {
  'Submitted': <CircleDashed />,
  'Under Review': <Milestone />,
  'Assigned': <Wrench />,
  'Resolved': <BadgeCheck />,
};

export function StatusTracker({ currentStatus }: { currentStatus: ProblemStatus }) {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="flex items-center w-full">
      {statuses.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <React.Fragment key={status}>
            <div className="flex flex-col items-center">
                <div
                    className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-white',
                    isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                    )}
                >
                    {isCompleted ? <CheckCircle2 /> : statusIcons[status]}
                </div>
                <p className={cn(
                    "text-xs mt-1 text-center",
                    isCurrent ? "font-bold text-blue-600" : "text-muted-foreground"
                )}>
                    {status}
                </p>
            </div>
            {index < statuses.length - 1 && (
              <div className={cn(
                'flex-1 h-1 mx-2',
                isCompleted ? 'bg-green-500' : 'bg-gray-300'
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
