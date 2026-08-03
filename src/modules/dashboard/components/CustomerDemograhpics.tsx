import { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MoreVertical } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const markers: { name: string; coordinates: [number, number] }[] = [
  { name: "USA", coordinates: [-100, 40] },
  { name: "France", coordinates: [2, 46] },
  { name: "Kazakhstan", coordinates: [76.8897, 43.2389] },
];

const countries = [
  { name: "Kazakhstan", flag: "🇰🇿", customers: 3025, percent: 80 },
  { name: "USA", flag: "🇺🇸", customers: 567, percent: 15 },
  { name: "France", flag: "🇫🇷", customers: 190, percent: 5 },
];

const WIDTH = 500;
const HEIGHT = 260;

function WorldMap() {
  const [geographies, setGeographies] =
    useState<FeatureCollection<Geometry> | null>(null);

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((topology) => {
        const geo = feature(
          topology,
          topology.objects.countries,
        ) as unknown as FeatureCollection<Geometry>;
        setGeographies(geo);
      });
  }, []);

  const projection = geoMercator()
    .scale(75)
    .translate([WIDTH / 2, HEIGHT / 1.5]);
  const pathGenerator = geoPath(projection);

  if (!geographies) {
    return (
      <div className="aspect-[500/260] w-full rounded-xl bg-gray-50 dark:bg-white/5 animate-pulse" />
    );
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-auto rounded-xl bg-gray-50 dark:bg-white/5"
    >
      {geographies.features.map((geo, i) => (
        <path
          key={i}
          d={pathGenerator(geo) ?? undefined}
          fill="var(--color-gray-200)"
          stroke="var(--color-white)"
          strokeWidth={0.5}
        />
      ))}
      {markers.map(({ name, coordinates }) => {
        const point = projection(coordinates);
        if (!point) return null;
        const [x, y] = point;
        return (
          <circle key={name} cx={x} cy={y} r={4} fill="var(--chart-blue)" />
        );
      })}
    </svg>
  );
}

export const CustomerDemographics = () => {
  return (
    <Card className="rounded-2xl border border-gray-200 p-6 bg-white dark:border-gray-800 dark:bg-white/3">
      <CardHeader className="flex flex-row items-start justify-between p-0 space-y-0">
        <div>
          <CardTitle>Customers Demographic</CardTitle>
          <CardDescription>Number of customer based on country</CardDescription>
        </div>
        <MoreVertical className="h-5 w-5 text-muted-foreground shrink-0" />
      </CardHeader>

      <CardContent className="p-0 mt-4 space-y-6">
        <WorldMap />

        <div className="space-y-5">
          {countries.map((c) => (
            <div key={c.name} className="flex items-center gap-4">
              <span className="text-2xl leading-none">{c.flag}</span>
              <div className="w-24 shrink-0">
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="text-xs text-muted-foreground">
                  {c.customers.toLocaleString()} Customers
                </div>
              </div>
              <div className="flex flex-1 items-center gap-3">
                <Progress value={c.percent} className="h-2" />
                <span className="w-9 text-right text-sm font-semibold">
                  {c.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
