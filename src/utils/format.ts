/**
 * 📊 Format Number Utility
 * แปลงตัวเลขให้อ่านง่ายขึ้นด้วยหน่วย K, M, B, T
 */

export const formatNumber = (num: number): string => {
    if (num < 1000) {
        return num.toString();
    } else if (num < 1000000) {
        return (num / 1000).toFixed(1) + 'K';
    } else if (num < 1000000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num < 1000000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    } else {
        return (num / 1000000000000).toFixed(1) + 'T';
    }
};

/**
 * 📊 Format Number with Commas (สำหรับตัวเลขที่ต้องการความแม่นยำสูง)
 */
export const formatNumberWithCommas = (num: number): string => {
    return num.toLocaleString();
};
