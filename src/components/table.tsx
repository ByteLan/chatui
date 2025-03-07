import * as React from 'react';
import { PropsWithChildren } from 'react';
import { get } from 'lodash';
import {Table} from '@douyinfe/semi-ui';
import { omit } from 'lodash';
import {TableProps} from "@douyinfe/semi-ui/lib/es/table";

const table: React.FC<PropsWithChildren<TableProps>> = (props: PropsWithChildren<TableProps>) => {

    const { children } = props;
    const toArray = value => Array.isArray(value) ? value : [value];
    const columnsFiber = toArray(get(children[0], 'props.children.props.children'));
    const dataFiber = toArray(get(children[1], 'props.children'));

    const titlesColumns = columnsFiber.map((column, i) => {
        return {
            dataIndex: String(i),
            title: column?.props?.children || ""
        };
    });
    const tableDataSource: any[] = [];
    for (let i = 0;i < dataFiber.length;i++) {
        let item: Record<string, string> = {
            key: String(i)
        };
        dataFiber[i]?.props.children?.forEach?.((child, index) => {
            item[String(index)] = child?.props?.children ?? "";
        });
        tableDataSource.push(item);
    }

    return <Table dataSource={tableDataSource} columns={titlesColumns} {...omit(props, 'children')}/>;
};

export default table;
