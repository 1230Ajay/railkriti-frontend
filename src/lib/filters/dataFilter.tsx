 export class DataFilter {
    /**
     * Filters the list of data objects based on the provided field names.
     * @param {string[]} fieldNames - List of field names to keep.
     * @param {Object[]} dataList - List of objects containing data.
     * @returns {Object[]} - Filtered list of objects.
     */
    static filterData(fieldNames:any, dataList:any) {
      return dataList.map((data:any) =>
        Object.fromEntries(
          Object.entries(data).filter(([key]) => fieldNames.includes(key))
        )
      );
    }
  }
  
