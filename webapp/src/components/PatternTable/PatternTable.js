import { useState, Fragment } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import HelpIcon from '@mui/icons-material/Help';

import styles from "./PatternTable.module.scss";
import { Tooltip } from '@mui/material';

import {formatDateToReadableString} from '../../services/tickerService'

const bullishEngulfingTooltip = "A bullish engulfing pattern is a candlestick pattern that forms when a small red candlestick is followed the next day by a large green candlestick, the body of which completely overlaps or engulfs the body of the previous day's candlestick.";
const dojiTooltip = "A Doji is a candlestick pattern that looks like a cross as the opening and closing prices are equal or almost the same.";
const threeLineStrikeTooltip = "A three-line strike is a continuation group of candlesticks that has three bars in the direction of a trend, followed by a final candle that pulls back to the start point. Traders make use of the three-line strike as an opportunity to buy at a current trend low or sell at a current high.";

function getPatternValue(value) {
    if (value) {
        return 'Yes';
    }

    return 'No';
}

export default function PatternTable({patternsData}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Fragment>
            <TableContainer component={Paper}>
                <Table aria-label="Pattern Table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Price (USD)</TableCell>
                            <TableCell>
                                <span className={styles.patternTableHeader}>
                                    <span className={styles.patternTableHeaderText}>Bullish Engulfing</span>
                                    <Tooltip title={bullishEngulfingTooltip}>
                                        <HelpIcon fontSize='24px'/>
                                    </Tooltip>
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className={styles.patternTableHeader}>
                                    <span className={styles.patternTableHeaderText}>Doji</span>
                                    <Tooltip title={dojiTooltip}>
                                        <HelpIcon fontSize='24px'/>
                                    </Tooltip>
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className={styles.patternTableHeader}>
                                    <span className={styles.patternTableHeaderText}>Three Line Strike</span>
                                    <Tooltip title={threeLineStrikeTooltip}>
                                        <HelpIcon fontSize='24px'/>
                                    </Tooltip>
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0 ? 
                            patternsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : 
                            patternsData).map((pattern) => (
                                <TableRow key={pattern.date}>
                                    <TableCell component="th" scope="row">
                                        {formatDateToReadableString(pattern.date)}
                                    </TableCell>
                                    <TableCell>{pattern.close}</TableCell>
                                    <TableCell>{getPatternValue(pattern.is_bullish_engulfing)}</TableCell>
                                    <TableCell>{getPatternValue(pattern.is_doji)}</TableCell>
                                    <TableCell>{getPatternValue(pattern.is_three_line_strike)}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                rowsPerPage={rowsPerPage}
                component={Paper}
                count={patternsData.length}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}>
            </TablePagination>
        </Fragment>
    )
}
