import * as React from 'react';
import Rating from '@mui/material/Rating';


interface IRatingProps {

  setValue: number

}

export default function BasicRating({setValue}: IRatingProps) {
  const [value] = React.useState<number>(setValue);
  
  return (

        <Rating name="read-only" value={value} readOnly />

  );
}
