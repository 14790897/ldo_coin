export function trimTrailingNumbersIfAny(url: string): string {
  const regex = /(\d+)(\D+)\d+$/;
  const match = url.match(regex);

  if (match) {
    console.log(match);
    // 获取基础 URL，即不包含最后的数字和可能的非数字字符
    const baseUrl = url.substring(0, url.length - match[0].length);
    // 将基础 URL 与第一个捕获组（match[1]）拼接
    return baseUrl + match[1];
  }

  // 如果没有匹配，返回原 URL
  return url;
}
// 测试函数
// const testUrl = "https://linux.do/t/topic/44454";
// console.log(trimTrailingNumbersIfAny(testUrl));
