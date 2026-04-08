import * as React from "react";
import { ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("context error");
  return context;
}

function ChartContainer({ id, className, children, config, ...props }) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn("flex w-full justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }) {
  const colorEntries = Object.entries(config).filter(([, c]) => c.color);
  if (!colorEntries.length) return null;

  const css = colorEntries
    .map(([key, c]) => (c.color ? ` --color-${key}: ${c.color};` : null))
    .filter(Boolean)
    .join("\n");

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart=${id}] {\n${css}\n}`,
      }}
    />
  );
}

const ChartTooltip = Tooltip;

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  hideLabel = false,
  formatter,
  labelFormatter,
  nameKey,
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {!hideLabel && (
        <div className="font-medium">
          {labelFormatter ? labelFormatter(label, payload) : label}
        </div>
      )}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = nameKey || item.name || item.dataKey || "value";
          const itemConfig = config[key] || config[item.dataKey] || {};
          const color = item.payload?.fill || item.color;

          return (
            <div
              key={item.dataKey ?? index}
              className="flex w-full items-center gap-2"
            >
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: color }}
              />
              <div className="flex flex-1 justify-between gap-2 leading-none">
                <span className="text-muted-foreground">
                  {itemConfig.label || item.name}
                </span>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {formatter
                    ? formatter(
                        item.value,
                        item.name,
                        item,
                        index,
                        item.payload,
                      )[0]
                    : item.value?.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = Legend;

function ChartLegendContent({ payload, className, nameKey, hideIcon = false }) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 pt-3",
        className,
      )}
    >
      {payload.map((item) => {
        const key = nameKey
          ? item.payload?.[nameKey]
          : item.dataKey || item.value;
        const itemConfig = config[key] || {};

        return (
          <div key={item.value} className="flex items-center gap-1.5 text-xs">
            {!hideIcon && (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span className="text-muted-foreground">
              {itemConfig.label || item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};
