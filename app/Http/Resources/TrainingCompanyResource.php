<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrainingCompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'industry' => $this->industry,
            'address' => $this->address,

            'contact_person' => $this->contact_person,
            'phone' => $this->phone,
            'contact_email' => $this->contact_email,

            'training_requests_count' => $this->training_requests_count,

            'user' => $this->whenLoaded('user'),
            'training_requests' => $this->whenLoaded('training_Requests'),
        ];
    }
}
