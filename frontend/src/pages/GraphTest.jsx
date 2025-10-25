import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ChartRadarDots } from "@/components/chart-radar-dots";

const GraphTest = () => {
    return (
        <div className="col-span-4">
            <ChartAreaInteractive />
            <ChartRadarDots />
        </div>
    )
}

export default GraphTest;