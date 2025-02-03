import React, { useEffect, useState } from "react";
import Button from "./subComponents/Button";
import InputField from "./subComponents/InputField";

const fetchApiData = async () => {
  return {
    rows: [
      {
        id: "electronics",
        label: "Electronics",
        children: [
          {
            id: "phones",
            label: "Phones",
            value: 800,
            originalValue: 800,
            variance: 0,
          },
          {
            id: "laptops",
            label: "Laptops",
            value: 700,
            originalValue: 700,
            variance: 0,
          },
        ],
      },
      {
        id: "furniture",
        label: "Furniture",
        children: [
          {
            id: "tables",
            label: "Tables",
            value: 300,
            originalValue: 300,
            variance: 0,
          },
          {
            id: "chairs",
            label: "Chairs",
            value: 700,
            originalValue: 700,
            variance: 0,
          },
        ],
      },
    ],
  };
};

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const apiResponse = await fetchApiData();

      const updatedRows = apiResponse.rows.map((category) => {
        const totalValue = category.children.reduce(
          (sum, child) => sum + child.value,
          0
        );
        return {
          ...category,
          value: totalValue,
          originalValue: totalValue,
          variance: 0,
        };
      });

      setData(updatedRows);
    };

    loadData();
  }, []);

  const handleInputChange = (id, value) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleAllocationPercentage = (id, isParent) => {
    const percentage = parseFloat(inputValues[id]);
    if (isNaN(percentage) || percentage === 0) return;

    setData((prevData) => {
      const updatedData = prevData.map((category) => {
        if (category.id === id && isParent) {
          const newParentValue = category.value * (1 + percentage / 100);
          const factor = newParentValue / category.value;

          const updatedChildren = category.children.map((child) => ({
            ...child,
            value: Math.round(child.value * factor),
            variance:
              ((child.value * factor - child.originalValue) /
                child.originalValue) *
              100,
          }));

          return {
            ...category,
            value: Math.round(newParentValue),
            children: updatedChildren,
            variance:
              ((newParentValue - category.originalValue) /
                category.originalValue) *
              100,
          };
        }

        // If child, increase only that row
        const updatedChildren = category.children.map((child) =>
          child.id === id
            ? {
                ...child,
                value: Math.round(child.value * (1 + percentage / 100)),
                variance:
                  ((child.value * (1 + percentage / 100) -
                    child.originalValue) /
                    child.originalValue) *
                  100,
              }
            : child
        );

        return { ...category, children: updatedChildren };
      });

      return updateVarianceAndSubtotal(updatedData);
    });
  };

  // 🔹 Handle Allocation Value
  const handleAllocationValue = (id, isParent) => {
    const newValue = parseFloat(inputValues[id]);
    if (isNaN(newValue) || newValue <= 0) return;

    setData((prevData) => {
      const updatedData = prevData.map((category) => {
        if (category.id === id && isParent) {
          const parentTotalValue = category.value;
          // Update parent value and distribute proportionally

          const updatedChildren = category.children.map((child) => {
            const childContributionPercentage =
              (child.value / parentTotalValue) * 100; // Contribution ratio

            return {
              ...child,
              value: Number(
                ((childContributionPercentage / 100) * newValue).toFixed(2)
              ),
              variance: Math.round(childContributionPercentage, 2),
            };
          });

          return {
            ...category,
            value: Math.round(newValue),
            children: updatedChildren,
            variance:
              ((newValue - category.originalValue) / category.originalValue) *
              100,
          };
        }

        // If child, update only that row
        const updatedChildren = category.children.map((child) =>
          child.id === id
            ? {
                ...child,
                value: Math.round(newValue),
                variance:
                  ((newValue - child.originalValue) / child.originalValue) *
                  100,
              }
            : child
        );

        return { ...category, children: updatedChildren };
      });

      return updateVarianceAndSubtotal(updatedData);
    });
  };

  // 🔹 Update variance and subtotal
  const updateVarianceAndSubtotal = (updatedData) => {
    return updatedData.map((category) => {
      const newTotal = category.children.reduce(
        (sum, child) => sum + child.value,
        0
      );
      return {
        ...category,
        value: Math.round(newTotal),
        variance:
          ((newTotal - category.originalValue) / category.originalValue) * 100,
      };
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Product Categories</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Label</th>
              <th>Value</th>
              <th>Input</th>
              <th>Allocation %</th>
              <th>Allocation Val</th>
              <th>Variance %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((category) => (
              <React.Fragment key={category.id}>
                <tr className="table-primary">
                  <td>{category.label}</td>
                  <td>
                    <strong>{category.value}</strong>
                  </td>
                  <td>
                    <InputField
                      type="number"
                      placeholder="Enter value"
                      value={inputValues[category.id] || ""}
                      onChange={(e) =>
                        handleInputChange(category.id, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Button
                      name="Allocate %"
                      onClick={() =>
                        handleAllocationPercentage(category.id, true)
                      }
                    />
                  </td>
                  <td>
                    <Button
                      name="Allocate Val"
                      onClick={() => handleAllocationValue(category.id, true)}
                    />
                  </td>
                  <td>{category.variance.toFixed(2)}%</td>
                </tr>
                {category.children.map((child) => (
                  <tr key={child.id}>
                    <td>~ {child.label}</td>
                    <td>{child.value}</td>
                    <td>
                      <InputField
                        type="number"
                        placeholder="Enter value"
                        value={inputValues[child.id] || ""}
                        onChange={(e) =>
                          handleInputChange(child.id, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Button
                        name="Allocate %"
                        onClick={() =>
                          handleAllocationPercentage(child.id, false)
                        }
                      />
                    </td>
                    <td>
                      <Button
                        name="Allocate Val"
                        onClick={() => handleAllocationValue(child.id, false)}
                      />
                    </td>
                    <td>{child.variance.toFixed(2)}%</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
