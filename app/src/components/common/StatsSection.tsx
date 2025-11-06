import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

export interface StatItem {
  id: string;
  label: string;
  value: number | string;
  previousValue?: number;
  format?: 'number' | 'currency' | 'percentage';
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  description?: string;
}

export interface StatGroup {
  title: string;
  description?: string;
  stats: StatItem[];
}

export interface ChartData {
  title: string;
  description?: string;
  type: 'bar' | 'line' | 'pie' | 'progress' | 'histogram';
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
}

interface StatsSectionProps {
  groups: StatGroup[];
  charts?: ChartData[];
  className?: string;
}

const formatValue = (value: number | string, format?: string): string => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined || isNaN(value)) return '0';
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(value);
    case 'percentage':
      return `${value}%`;
    case 'number':
    default:
      return value.toLocaleString('es-MX');
  }
};

const getTrendIcon = (current: number, previous?: number) => {
  if (!previous) return <FiMinus className="h-4 w-4" />;
  
  if (current > previous) return <FiTrendingUp className="h-4 w-4 text-green-500" />;
  if (current < previous) return <FiTrendingDown className="h-4 w-4 text-red-500" />;
  return <FiMinus className="h-4 w-4 text-gray-500" />;
};

const getTrendPercentage = (current: number, previous?: number): string => {
  if (!previous || previous === 0) return '';
  
  const change = ((current - previous) / previous) * 100;
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

const StatCard = ({ stat }: { stat: StatItem }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    green: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    red: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    purple: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
    gray: 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800',
  };

  const iconColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    purple: 'text-purple-600 dark:text-purple-400',
    gray: 'text-gray-600 dark:text-gray-400',
  };

  const trendPercentage = getTrendPercentage(
    typeof stat.value === 'number' ? stat.value : 0,
    stat.previousValue
  );

  return (
    <Card className={`${colorClasses[stat.color || 'gray']} transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {stat.icon && (
                <div className={iconColorClasses[stat.color || 'gray']}>
                  {stat.icon}
                </div>
              )}
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.label}
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatValue(stat.value, stat.format)}
            </p>
            {stat.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            )}
          </div>
          
          {stat.previousValue !== undefined && (
            <div className="flex flex-col items-end">
              {getTrendIcon(
                typeof stat.value === 'number' ? stat.value : 0,
                stat.previousValue
              )}
              {trendPercentage && (
                <Badge variant="secondary" className="text-xs mt-1">
                  {trendPercentage}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const HistogramChart = ({ chart }: { chart: ChartData }) => {
  const maxValue = Math.max(...chart.data.map(item => item.value));
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#EF4444', // red
    '#F59E0B', // yellow
    '#8B5CF6', // purple
    '#6B7280', // gray
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{chart.title}</CardTitle>
        {chart.description && (
          <CardDescription>{chart.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between h-64 gap-2">
          {chart.data.map((item, index) => {
            const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            const color = item.color || colors[index % colors.length];
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 max-w-16">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {item.value.toLocaleString()}
                </div>
                <div 
                  className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                  style={{ 
                    height: `${height}%`, 
                    backgroundColor: color,
                    minHeight: '8px'
                  }}
                ></div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center leading-tight max-w-full overflow-hidden">
                  <span className="block truncate" title={item.label}>
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const SimpleChart = ({ chart }: { chart: ChartData }) => {
  // Handle different chart types
  if (chart.type === 'histogram') {
    return <HistogramChart chart={chart} />;
  }

  // Default to progress bars for other types
  const maxValue = Math.max(...chart.data.map(item => item.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{chart.title}</CardTitle>
        {chart.description && (
          <CardDescription>{chart.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {chart.data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {item.value.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={(item.value / maxValue) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export function StatsSection({ groups, charts, className = "" }: StatsSectionProps) {
  return (
    <div className={`space-y-6${className}`}>
      {/* Stats Groups */}
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {group.title}
            </h3>
            {group.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {group.description}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {group.stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      ))}

      {/* Charts */}
      {charts && charts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gráficos y Tendencias
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {charts.map((chart, index) => (
              <SimpleChart key={index} chart={chart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
