// import {Line} from "@ant-design/charts";
import {Flex} from "antd";
import { Resizable } from '@douyinfe/semi-ui';
import { ResponsiveLine } from '@nivo/line';
import {JSX} from "react";

function SimDataShowContent({simDataShowItems}: { simDataShowItems: { key: string, componentType: string, componentInput: any }[]}) {
    const result: JSX.Element[] = [];
    simDataShowItems.map((item) => {
        if (item.componentType === 'antdLine') {
            result.push(
                <Resizable
                    style={{ backgroundColor: 'rgba(var(--semi-blue-0), 1)', border: '1px solid #ccc', padding:8, borderRadius: 6 }}
                    defaultSize={{
                        width: 700,
                        height: 400,
                    }}
                >
                    {/*<div style={{height: '100%', width: '100%'}}>*/}
                    {/*    <Line {...item.componentInput['config']} style={{height: '100%', width: '100%'}}/>*/}
                    {/*</div>*/}
                    <ResponsiveLine
                        data={item.componentInput['data']}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        xScale={{ type: 'point' }}
                        yScale={{
                            type: 'linear',
                            min: 'auto',
                            max: 'auto',
                            stacked: true,
                            reverse: false
                        }}
                        yFormat=" >-.2f"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'transportation',
                            legendOffset: 36,
                            legendPosition: 'middle',
                            truncateTickAt: 0
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'count',
                            legendOffset: -40,
                            legendPosition: 'middle',
                            truncateTickAt: 0
                        }}
                        pointSize={10}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabel="data.yFormatted"
                        pointLabelYOffset={-12}
                        enableTouchCrosshair={true}
                        useMesh={true}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 100,
                                translateY: 0,
                                itemsSpacing: 0,
                                itemDirection: 'left-to-right',
                                itemWidth: 80,
                                itemHeight: 20,
                                itemOpacity: 0.75,
                                symbolSize: 12,
                                symbolShape: 'circle',
                                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemBackground: 'rgba(0, 0, 0, .03)',
                                            itemOpacity: 1
                                        }
                                    }
                                ]
                            }
                        ]}
                    />
                </Resizable>
                // <div style={{ height: 300 , width}}>
                //     <Line {...item.componentInput['config']} />
                // </div>
            );
        }
    });
    return (
        <div style={{height: '99%', width: '99%', overflow: 'auto'}}>
            <Flex wrap gap="small">
                {result}
            </Flex>
        </div>


    );
}

export default SimDataShowContent;